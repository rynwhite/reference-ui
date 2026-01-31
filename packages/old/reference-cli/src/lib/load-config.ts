import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'

const req = createRequire(import.meta.url)

export interface ReferenceConfig {
  include?: string[]
}

/**
 * Load reference config from the package root.
 * Prefer package.json "reference" key, then reference.config.js.
 */
export function loadReferenceConfig(packageRoot: string): ReferenceConfig {
  const pkgPath = resolve(packageRoot, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      if (pkg.reference && typeof pkg.reference === 'object' && pkg.reference.include) {
        return { include: pkg.reference.include }
      }
    } catch {
      // ignore
    }
  }
  const jsPath = resolve(packageRoot, 'reference.config.js')
  if (existsSync(jsPath)) {
    try {
      const mod = req(jsPath)
      return (mod.default ?? mod) || {}
    } catch {
      // ignore
    }
  }
  return {}
}
