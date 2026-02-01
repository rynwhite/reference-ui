export default {
  entry: ['src/entry/index.ts', 'src/cli/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
}
