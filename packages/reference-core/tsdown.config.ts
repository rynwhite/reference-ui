import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  external: [
    'react',
    'react-dom',
    '@reference-ui/system',
    /^@reference-ui\/system\/.*/,
  ],
});
