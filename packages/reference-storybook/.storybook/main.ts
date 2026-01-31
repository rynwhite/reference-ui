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
    const storybookRoot = resolve(__dirname, '..');
    const dotReference = resolve(storybookRoot, '.reference');

    return mergeConfig(config, {
      plugins: [react(), nxViteTsPaths(), stencilHmrPlugin()],
      resolve: {
        alias: {
          '@reference-ui/core/styles.css': resolve(dotReference, 'panda.css'),
          '@reference-ui/system/css': resolve(dotReference, 'css/index.js'),
          '@reference-ui/system/recipes': resolve(dotReference, 'recipes/index.js'),
          '@reference-ui/system/patterns': resolve(dotReference, 'patterns/index.js'),
          '@reference-ui/system/tokens': resolve(dotReference, 'tokens/index.js'),
          '@reference-ui/system': resolve(dotReference, 'css/index.js'),
          '@reference-ui/core/react': resolve(packagesDir, 'reference-core/dist/react.mjs'),
          '@reference-ui/core': resolve(packagesDir, 'reference-core/dist/index.mjs'),
        },
        dedupe: ['@reference-ui/core'],
      },
      optimizeDeps: {
        exclude: ['@reference-ui/core', '@reference-ui/core/react', '@reference-ui/system'],
      },
      server: {
        fs: { allow: [packagesDir, monorepoRoot, dotReference] },
        watch: { ignored: ['**/node_modules/**'] },
      },
    });
  },
};

export default config;
