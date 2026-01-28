import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const copyPandaCss = () => ({
  name: 'copy-panda-css',
  closeBundle() {
    const outDir = resolve(__dirname, 'dist');
    const candidates = [
      resolve(__dirname, '../../reference-system/panda.css'),
      resolve(__dirname, 'node_modules/@reference-ui/system/panda.css'),
    ];
    const src = candidates.find(existsSync);
    if (src) {
      copyFileSync(src, resolve(outDir, 'styles.css'));
    }
  },
});

export default defineConfig({
  plugins: [
    copyPandaCss(),
    dts({
      include: ['src'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/react.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        return entryName === 'index' ? `index.${ext}` : `react.${ext}`;
      },
    },
    rollupOptions: {
      // Only externalize React (peer dependency) and workspace packages
      // Bundle lit and @lit/react for portability
      external: [
        'react',
        'react-dom',
        '@reference-ui/system',
        /^@reference-ui\/system\/.*/,
      ],
      output: {
        // For multiple entry points, we can't use inlineDynamicImports
        // Instead, ensure chunks are properly handled
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@reference-ui/system': '@reference-ui/system',
        },
      },
    },
    sourcemap: true,
    target: 'es2022',
  },
});
