const { resolve } = require('path');
const { copyFileSync, existsSync, mkdirSync } = require('fs');

const root = resolve(__dirname, '..');
const outDir = resolve(root, 'dist');
const candidates = [
  resolve(root, '../../packages/reference-system/panda.css'),
  resolve(root, 'node_modules/@reference-ui/system/panda.css'),
];
const src = candidates.find(existsSync);
if (src) {
  mkdirSync(outDir, { recursive: true });
  copyFileSync(src, resolve(outDir, 'styles.css'));
}
