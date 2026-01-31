import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Resolve the tsdown binary from the CLI's node_modules.
 * Bypasses package manager - direct execution.
 */
function resolveTsdownBin(): string {
  // When bundled by tsdown: __dirname is dist/ (single-file bundle)
  // So CLI root is one level up
  const cliRoot = resolve(__dirname, '..')
  
  // Try multiple possible locations
  const candidates = [
    resolve(cliRoot, 'node_modules/.bin/tsdown'),
    resolve(cliRoot, '../node_modules/.bin/tsdown'), // monorepo workspace root
    resolve(cliRoot, '../../node_modules/.bin/tsdown'),
  ]
  
  for (const bin of candidates) {
    if (existsSync(bin)) {
      return bin
    }
  }
  
  throw new Error(
    `@reference-ui/cli: tsdown not found. Searched: ${candidates.join(', ')}`
  )
}

/**
 * Run tsdown in the given directory (e.g. packageRoot/.reference).
 * Uses that directory's tsdown.config.ts. Output goes to that directory's dist/.
 */
export function runTsdown(cwd: string): void {
  const tsdownBin = resolveTsdownBin()
  execSync(`"${tsdownBin}"`, {
    cwd,
    stdio: 'inherit',
  })
}
