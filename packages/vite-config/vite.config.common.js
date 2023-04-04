import path from 'path';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import EnvironmentPlugin from 'vite-plugin-environment';

export const createCommonConfig = (options) => {
  const { dirname, envVars = [] } = options;

  return {
    plugins: [react(), EnvironmentPlugin(envVars)],
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
      },
    },
    optimizeDeps: {
      target: 'es2020',
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
            crypto: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        plugins: [nodePolyfills()],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
};

/**
 * TODO: move to typescript
 * * The actual problem is we can't import typescript directly in the vite.config.ts file
 * ? We need to transpile before the package before ?
 */
