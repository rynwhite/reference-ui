import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    // Match any @reference-ui/core imports
    /^@reference-ui\/core/,
    '@stencil/react-output-target/runtime'
  ],
});
