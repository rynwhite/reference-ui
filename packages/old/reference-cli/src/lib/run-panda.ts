import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

const req = createRequire(import.meta.url)

/**
 * Run the Panda CLI with given arguments.
 * Resolves @pandacss/dev from this package's node_modules.
 */
export function runPanda(cwd: string, args: string[]): boolean {
  try {
    // Resolve panda's package.json from our dependencies
    const pandaPkgPath = req.resolve('@pandacss/dev/package.json')
    const pandaDir = resolve(pandaPkgPath, '..')
    const pandaBin = resolve(pandaDir, 'bin.js')

    const result = spawnSync(process.execPath, [pandaBin, ...args], {
      cwd,
      stdio: 'inherit',
    })

    return result.status === 0
  } catch (error) {
    console.error('@reference-ui/cli: Failed to run Panda CLI:', error)
    return false
  }
}
