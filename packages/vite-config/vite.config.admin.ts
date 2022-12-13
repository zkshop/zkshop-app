import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  // Node.js global to browser globalThis
  // define: {
  //   global: "globalThis",
  // },
  plugins: [
    react(),
    inject({
      util: 'util/',
    }),
    EnvironmentPlugin([
      'APP_ID',
      'HASURA_API_URL',
      'HASURA_API_KEY',
      'ALCHEMY_SECRET_KEY',
      'FUNCTIONS_API',
      'PAPER_CLIENT_ID',
      'SUPABASE_API_KEY',
    ]),
  ],
  define: {
    'process.env': {
      APP_ID: '2b1a5788-cc27-4530-a346-a5aa674bb523',
      HASURA_API_URL: 'https://smashing-albacore-74.hasura.app/v1/graphql',
      HASURA_API_KEY: 'nCVvYfVZn0kVQd39iG0OQ2uqbq2G2CLpX6oTLHU9OoHINzFiL5f4CwtzJ0hSRiEI',
      ALCHEMY_SECRET_KEY: 'x97VSdTdeVeFEUpCDRH1ENsSyi5PYPIP',
      PUBLIC_MAGIC_PUBLISHABLE_KEY: 'pk_live_4D8A794EBE593D7D',
      MAGIC_SECRET_KEY: 'sk_live_23C4458F3EEE6FF9',
      SUPABASE_API_KEY:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxanl0Z3hidGV0emV3aXBpa2F4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NTczNzc5NSwiZXhwIjoxOTgxMzEzNzk1fQ.913rq_gUqPxJxDK4lYvrrmophNnupbN09LqCp6wUAQ4',
      FUNCTIONS_API: 'https://functions.3shop.co',
      PAPER_CLIENT_ID: 'a8a84815-f9dc-4292-8724-850ec225fb90',
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      plugins: [nodePolyfills()],
      output: {
        inlineDynamicImports: true,
        entryFileNames: '[name].js', // currently does not work for the legacy bundle
        assetFileNames: '[name].[ext]', // currently does not work for images
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // Node.js global to browser globalThis
      // define: {
      //   global: "globalThis",
      // },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
