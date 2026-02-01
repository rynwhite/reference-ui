export default {
  entry: ['src/index.ts', 'cli/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
}
