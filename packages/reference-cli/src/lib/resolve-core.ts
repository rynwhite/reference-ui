import { createRequire } from 'node:module'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

const CORE_SOURCE_FILES = [
  'src/components/Button.ts',
  'src/tokens.ts',
  'src/panda-config.ts',
  'src/css.ts',
] as const

const OUTPUT_KEYS = [
  'components/Button.ts',
  'tokens.ts',
  'panda-config.ts',
  'css.ts',
] as const

/**
 * Resolve the path to @reference-ui/core package (from CLI's resolution).
 * Uses the main export instead of package.json.
 */
export function resolveCorePackageDir(): string {
  const coreMainPath = require.resolve('@reference-ui/core')
  // coreMainPath is like: /path/to/core/src/index.ts
  // Go up one directory to get the package root
  return dirname(dirname(coreMainPath))
}

/**
 * Read reference-core source files and return a map of logical paths to content.
 * Keys: "components/Button.ts", "tokens.ts", "panda-config.ts", "css.ts"
 */
export function readCoreSourceFiles(coreDir: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (let i = 0; i < CORE_SOURCE_FILES.length; i++) {
    const srcPath = resolve(coreDir, CORE_SOURCE_FILES[i])
    if (!existsSync(srcPath)) {
      throw new Error(`@reference-ui/cli: core source not found: ${srcPath}`)
    }
    out[OUTPUT_KEYS[i]] = readFileSync(srcPath, 'utf-8')
  }
  return out
}
