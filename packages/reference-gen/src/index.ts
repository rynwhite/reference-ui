/**
 * Reference Gen - design system compiler.
 * Consumes reference-core as source, produces BuildResult in memory.
 * No filesystem access. CLI materializes output.
 */

import { compile } from './compile.js'
import type { BuildResult, GenerateDesignSystemConfig } from './types.js'

export function generateDesignSystem(config: GenerateDesignSystemConfig = {}): BuildResult {
  return compile(config)
}

export type { BuildResult, GenerateDesignSystemConfig } from './types.js'
