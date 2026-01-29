import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: {
    build: true
  },
  clean: true,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  platform: 'node',
  target: 'node18',
  // Specify tsconfig for build
  tsconfig: './tsconfig.lib.json',
  // Bundle all dependencies for the CLI
  noExternal: [/.*/],
  // Keep Node.js built-ins external
  external: [/^node:/, 'fsevents']
});
