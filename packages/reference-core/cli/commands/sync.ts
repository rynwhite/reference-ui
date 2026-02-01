import { copyToNodeModules } from '../lib/copy-to-node-modules.js'
import { resolveCorePackageDir } from '../lib/resolve-core.js'
import { runTsdown } from '../lib/run-tsdown.js'

/**
 * Sync command: build reference-core and materialize to node_modules.
 * Runs during postinstall and as part of ref-sync.
 */
export async function syncCommand(cwd: string): Promise<void> {
  const coreDir = resolveCorePackageDir()

  // Build reference-core with tsdown (generates dist/)
  await runTsdown(coreDir)

  // Copy built dist/ to node_modules @reference-ui namespaces
  copyToNodeModules(cwd, coreDir)
}
