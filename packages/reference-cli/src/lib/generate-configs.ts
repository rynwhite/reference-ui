import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const DOT_REFERENCE = '.reference'

const TSCONFIG_JSON = `{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["system/**/*"]
}
`

const TSDOWN_CONFIG_TS = `export default {
  entry: ['system/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  inlineOnly: false,
}
`

/**
 * Write .reference/tsconfig.json and .reference/tsdown.config.ts
 * so tsdown can bundle the system output.
 */
export function generateDotReferenceConfigs(packageRoot: string): void {
  const dotRefDir = resolve(packageRoot, DOT_REFERENCE)
  mkdirSync(dotRefDir, { recursive: true })

  writeFileSync(resolve(dotRefDir, 'tsconfig.json'), TSCONFIG_JSON, 'utf-8')
  writeFileSync(resolve(dotRefDir, 'tsdown.config.ts'), TSDOWN_CONFIG_TS, 'utf-8')
}
