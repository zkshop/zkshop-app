import { createDeployCommand, createFunctions, Function } from '../lib/functions.js';
import { getArgs, MandatoryEnvException, createHashStringForFile, jsonToBash } from '../utils.js';
import generateYaml, {
  defaultOptions as YamlDefaultOptions,
} from '../modules/generateApiGatewayYaml.js';
import deployCloudFunctions from '../modules/deployCloudFunctions.js';
import fs from 'fs';
import yaml from 'js-yaml';
import dotenv from 'dotenv';
import util from 'util';
import child_process from 'child_process';
import { listConfigs } from '../lib/api/listConfigs.js';
import ora from 'ora';
import Multispinner from 'multispinner';
import { listFiles, uploadFile, uploadFileDefaultOptions } from '../lib/api/bucket.js';

const exec = util.promisify(child_process.exec);

const mandatoryEnvs = ['SERVICE_ACCOUNT', 'GCP_REGION', 'GCP_PROJECT', 'SORCEL_PROJECT_ROOT'];
const supportedOptions = [
  'ignore-functions',
  'include-only',
  'for-production',
  'for-staging',
  'no-deploy',
  'no-config',
];
const defaultOptions = {};
const parseArgs = new Map([
  ['ignore-functions', (key) => key.split(' ')],
  ['include-only', (key) => key.split(' ')],
  ['for-production', (key) => 'production'],
  ['for-staging', (key) => 'staging'],
  ['no-deploy', (key) => true],
  ['no-config', (key) => true],
]);

let tasks = [];
const addTask = (description, ...callbacks) => (tasks = [...tasks, { description, callbacks }]);

const isAsync = (fn) => {
  return fn.constructor.name === 'AsyncFunction';
};

const executeTasks = async () => {
  let global = {};

  const spinners = tasks.map((t) => {
    return ora(t.description);
  });
  for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    const { description, callbacks } = tasks[taskIndex];
    let ctx = {};
    let subtasks = new Map();
    ctx['global'] = global;
    ctx['describe'] = (message) => {
      spinners[taskIndex].text = `${description}\n└──${message}`;
    };
    ctx['critical'] = (code, message) => {
      ctx._spinner.fail(`${description}: ${message}`);
      process.exit(code);
    };
    ctx['createSubtask'] = (id, text) => {
      const spinner = ora(text);
      subtasks.set(id, spinner);
      return spinner;
    };
    ctx['subtask'] = (id) => {
      return subtasks.get(id);
    };

    ctx._spinner = spinners[taskIndex];

    const executeCallback = async (index) => {
      if (index >= callbacks.length) return;

      const callback = callbacks[index];
      const skip = (reason) => {
        ctx._spinner.info(`skipped: ${description} (${reason})`);
        executeCallback(callbacks.length);
      };
      const next = () => executeCallback(index + 1);

      ctx._spinner.start();
      if (isAsync(callback)) await callback(ctx, next, skip);
      else callback(data, next, skip);
      if (ctx._spinner.isSpinning) ctx._spinner.succeed(description);
      ctx._spinner.stop();
    };

    await executeCallback(0);
  }
};

const checkEnvs = (keys) => {
  for (const env of keys) {
    if (!process.env[env]) {
      throw new MandatoryEnvException(env, keys);
    }
  }
};

process.on('exit', async (code) => {
  await exec('(rm .env.staging || true) && (rm .env.production || true)');
});

function log(message, isError = false) {
  const color = isError ? '\x1b[31m' : '\x1b[32m'; // Red for error, Green for normal
  console.error(color, message);
}

const envToYaml = (envFileName) => {
  const envFile = fs.readFileSync(`../${envFileName}`);
  const envObject = dotenv.parse(envFile);
  const envYaml = yaml.dump(envObject);

  const outfile = `${process.env.PWD}/.env.yaml`;
  fs.writeFileSync(outfile, envYaml);
  return outfile;
};

async function main(args) {
  const options = getArgs(
    {
      supportedOptions,
      defaultOptions,
      parseArgs,
    },
    args || process.argv.slice(2),
  );

  let envYamlPath = undefined;

  addTask('checking env variables', async (ctx) => {
    checkEnvs(mandatoryEnvs);

    if (!options['for-production'] && !options['for-staging']) {
      log(
        'Please provide a deployment mode.\nUse --for-production for production mode or --for-staging for staging mode.',
        true,
      );
      process.exit(0);
    } else {
      const envToPull = String(options['for-production'] || options['for-staging']);
      // ENV_CONTEXT necessary for deployCloudFunctions
      process.env['ENV_CONTEXT'] = ctx.global['deploymentEnvContext'] = envToPull;

      await Function.do(
        [`ls .env.${envToPull}`],
        '../',
        (childProcess) => {
          childProcess.on('error', (code) => {
            ctx.critical(code, `env for ${envToPull} must be present in ..${process.env.PWD}`);
          });
          childProcess.on('exit', (code) => {
            if (code != 0)
              ctx.critical(code, `env for ${envToPull} must be present in ..${process.env.PWD}`);
          });
        },
        true,
      );
    }
  });

  addTask('parsing functions', async () => {
    createFunctions(options['include-only'], options['ignore-functions']);
  });

  {
    addTask('creating yaml env file', async (ctx) => {
      ctx.global['envYamlPath'] = envToYaml(
        options['for-production'] ? '.env.production' : '.env.staging',
      );
    });

    //TODO: duplicate task, move down
    addTask('deploying functions', async (ctx) => {
      // log(`deploying functions ${Function.allFunctions.map((f) => f.name)}`);
    });
  }
  addTask('Creating api-gateway config', async (ctx, next, skip) => {
    if (options['no-config']) return skip('Command line argument provided');

    await Function.do(
      [`mkdir -p ./results/${ctx.global.deploymentEnvContext}`],
      process.env.PWD,
      (childProcess) => {
        childProcess.on('error', (error) => {
          // TODO: handle error
        });
      },
    );
    const yamlPath = `./results/${ctx.global.deploymentEnvContext}/api-gateway.yaml`;
    await generateYaml({
      ...YamlDefaultOptions,
      'yaml-outfile': yamlPath,
    });

    const newHash = createHashStringForFile(yamlPath);
    ctx.describe('Reading existing configs');
    const existingConfigNames = await listConfigs(process.env.SORCEL_API)
      .then(({ data }) => {
        const names = data.apiConfigs.map((conf) => conf.displayName);
        return names.filter((id) => id.split('-')[0] == ctx.global.deploymentEnvContext);
      })
      .catch((e) => {
        console.error(e);
        // TODO: handle error
      });
    ctx.global['apiConfigName'] = String(`${ctx.global.deploymentEnvContext}-${newHash}`);
    const [createConfigCmd, createConfig] = jsonToBash({
      command: `gcloud api-gateway api-configs create ${ctx.global.apiConfigName}`,
      args: {
        api: process.env.SORCEL_API,
        openapiSpec: yamlPath,
        project: process.env.SORCEL_PROJECT,
      },
    });
    if (existingConfigNames.find((name) => name == ctx.global.apiConfigName))
      return skip('already exist');
    ctx.describe('Running CLI command');
    await Function.do([createConfigCmd], process.env.PWD, (_process, index) => {
      _process.stderr.on('data', (data) => {});
      _process.stdout.on('data', (data) => {});
    });
  });

  addTask(`Updating api-gateway with config`, async (ctx, next, skip) => {
    if (options['no-config']) return skip('Command line argument provided');
    const [apiGateWayCmd, apiGateWay] = jsonToBash({
      command: `gcloud api-gateway gateways update sorcel-gateway-${ctx.global.deploymentEnvContext}`,
      args: {
        api: process.env.SORCEL_API,
        apiConfig: ctx.global.apiConfigName,
        location: process.env.SORCEL_LOCATION,
        project: process.env.SORCEL_PROJECT,
      },
    });

    await Function.do([apiGateWayCmd], process.env.PWD, (_process, index) => {
      _process.stderr.on('data', (data) => {
        // console.log(`create config: ${data}`);
      });
      _process.stdout.on('data', (data) => {
        // console.log(`create config: ${data}`);
      });
    });
  });

  addTask(
    'Deploying functions',
    async (ctx, next) => {
      if (options['no-deploy']) return skip('Command line argument provided');
      ctx.describe('Generating CLI commands');
      Function.allFunctions.forEach((f) => {
        f.setDeployOptions((opts) => {
          opts.envVarsFile = ctx.global.envYamlPath;
          return opts;
        });
        createDeployCommand(f);
      });
      return next();
    },
    async (ctx, next, skip) => {
      ctx.describe('Checking for changes');
      const bucketName = `bundled-functions-${ctx.global.deploymentEnvContext}`;

      await Function.do(['touch scripts/blank_file'], process.env.PWD, (process) => {
        process.on('error', (error) => {
          // TODO: handle error
        });
      });

      Function.allFunctions.forEach(
        (f) => (f.hash = createHashStringForFile(`${f.path}/index.cjs`)),
      );

      // Fetching bucket content with google api then creating a map from file names (<function name>:<hash>)
      const fileNames = (
        await listFiles(bucketName).catch((e) => {
          //TODO: handle error
          console.error(e);
        })
      ).map((f) => f.name);
      const functionsHashMap = new Map(fileNames.map((name) => name.split(':')));

      ctx.global['liveFunctionsNames'] = [];
      Function.allFunctions.forEach((f) => {
        const liveHash = functionsHashMap.get(f.name);
        if (liveHash && liveHash == f.hash) {
          ctx.global.liveFunctionsNames = [...ctx.global.liveFunctionsNames, f.name];
          Function.removeFunctionById(f.id);
        }
      });
      return next();
    },
    async (ctx, next, skip) => {
      ctx._spinner.info('Deploying functions');
      ctx._spinner.stopAndPersist();
      const spinners = {};
      const liveFunctionsNames = ctx.global.liveFunctionsNames;

      // Functions to deploy
      for (const f of Function.allFunctions) {
        spinners[f.name] = f.name;
      }

      // Already up to date functions (if any)
      for (const liveFunction of liveFunctionsNames) {
        spinners[liveFunction] = `${liveFunction}: (already up to date)`;
      }
      let multi = new Multispinner(spinners);
      liveFunctionsNames.forEach((name) => multi.success(name));

      ctx.describe('Uploading');
      await deployCloudFunctions((_function, childProcess, index) => {
        childProcess.on('close', async (code) => {
          if (index == 2) {
            if (code != 0) {
              multi.error(_function.name);
            } else {
              multi.success(_function.name);

              await uploadFile(
                `bundled-functions-${ctx.global.deploymentEnvContext}`,
                `${process.env.PWD}/scripts/blank_file`,
                { ...uploadFileDefaultOptions, destination: `${_function.name}:${_function.hash}` },
              ).catch((e) => {
                //TODO: handle error
                console.error(e);
              });
            }
          }
        });
      }, true).catch((e) => {
        console.error(e);
        process.exit(1);
      });
    },
  );

  addTask('cleaning up', async () => {
    await Function.do(['rm scripts/blank_file'], process.env.PWD);
  });
  await executeTasks();
}

main();
// test();
