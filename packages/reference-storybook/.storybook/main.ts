import type { StorybookConfig } from '@storybook/react-vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { stencilHmrPlugin } from './stencil-hmr-plugin';

const config: StorybookConfig = {
  stories: ['../src/lib/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (config) => {
    const packagesDir = resolve(__dirname, '../..');
    const monorepoRoot = resolve(packagesDir, '..');
    
    return mergeConfig(config, {
      plugins: [react(), nxViteTsPaths(), stencilHmrPlugin()],
      resolve: {
        alias: {
          '@reference-ui/core/styles.css': resolve(packagesDir, 'reference-system/panda.css'),
          // Point to dist files for HMR (changes trigger reloads)
          '@reference-ui/core/react': resolve(packagesDir, 'reference-core/dist/react.js'),
          '@reference-ui/core': resolve(packagesDir, 'reference-core/dist/index.js'),
        },
        dedupe: ['@reference-ui/core'],
      },
      optimizeDeps: {
        exclude: ['@reference-ui/core', '@reference-ui/core/react', '@reference-ui/system'],
      },
      server: {
        fs: { allow: [packagesDir, monorepoRoot] },
        watch: { ignored: ['**/node_modules/**'] },
      },
    });
  },
};

export default config;
