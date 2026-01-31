import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'

const CONFIG_FILES = ['reference.config.ts', 'reference.config.js', 'reference.config.mjs']

/**
 * Resolve the package root (the package where reference-ui is installed).
 * Scope is this package only—not Nx workspace.
 */
export function resolvePackageRoot(startCwd: string = process.cwd()): string {
  let dir = resolve(startCwd)
  const root = dirname(dir)
  while (dir !== root) {
    if (CONFIG_FILES.some((f) => existsSync(resolve(dir, f)))) {
      return dir
    }
    try {
      const pkgPath = resolve(dir, 'package.json')
      if (existsSync(pkgPath)) {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
        if (pkg.reference != null || pkg.dependencies?.['@reference-ui/core'] != null) {
          return dir
        }
      }
    } catch {
      // ignore
    }
    dir = dirname(dir)
  }
  return startCwd
}
