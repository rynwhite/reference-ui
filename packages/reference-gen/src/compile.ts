import type { BuildResult, GenerateDesignSystemConfig } from './types.js'
import { loadCore } from './load-core.js'

/**
 * Core compilation logic. Pure - no filesystem access.
 * Returns in-memory BuildResult; CLI writes to disk.
 */
export function compile(config: GenerateDesignSystemConfig): BuildResult {
  loadCore() // ensures core is loadable as source
  const tokensUsed = config.tokens ? ['custom'] : ['gray', 'primary']
  const components = config.components ?? ['RefButton']

  const files = new Map<string, string | Uint8Array>()
  files.set('metadata.json', JSON.stringify({ tokensUsed, components }, null, 2))

  const hash = `stub-${Date.now()}`

  return {
    files,
    metadata: {
      hash,
      tokensUsed,
      components,
    },
  }
}
