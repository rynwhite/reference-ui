import { generateDesignSystem } from '@reference-ui/gen'
import { materializeBuildResult } from '../lib/materialize.js'
import { runTsdown } from '../lib/run-tsdown.js'
import { generateDotReferenceConfigs } from '../lib/generate-configs.js'
import { resolveCorePackageDir, readCoreSourceFiles } from '../lib/resolve-core.js'
import { copyToNodeModules } from '../lib/copy-to-node-modules.js'
import { resolve } from 'node:path'

const DOT_REFERENCE = '.reference'

/**
 * reference sync - invokes gen, materializes to .reference/system/, runs tsdown, copies to node_modules.
 * Bypasses package manager; direct file I/O. Output goes to node_modules/@reference/system for painless imports.
 */
export async function syncCommand(cwd: string): Promise<void> {
  const coreDir = resolveCorePackageDir()
  const sourceFiles = readCoreSourceFiles(coreDir)

  const result = generateDesignSystem({ sourceFiles })

  materializeBuildResult(cwd, result)
  generateDotReferenceConfigs(cwd)
  runTsdown(resolve(cwd, DOT_REFERENCE))
  copyToNodeModules(cwd)
}
