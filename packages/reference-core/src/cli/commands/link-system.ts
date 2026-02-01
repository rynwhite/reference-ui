import { resolveCorePackageDir } from '../lib/resolve-core.js'
import { linkLocalSystem } from '../lib/link-local-system.js'

/**
 * Link command: create a local @reference-ui/system package for monorepo dev.
 */
export async function linkSystemCommand(cwd: string): Promise<void> {
  const coreDir = resolveCorePackageDir()
  linkLocalSystem(coreDir, cwd)
}
