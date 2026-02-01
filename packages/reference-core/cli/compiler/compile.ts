import type { GenerateDesignSystemConfig } from './types.js'

export interface BuildResult {
  files: Map<string, string | Uint8Array>
  metadata: {
    hash: string
    tokensUsed: string[]
    components: string[]
  }
}

function debugCompileStep(step: string, data: unknown): void {
  if (process.env.REFERENCE_DEBUG === '1') {
    console.log(`[DEBUG] ${step}:`, data)
  }
}

function rewriteCoreImportsForConsumer(sourcePath: string, content: string): string {
  // Core components reference core's internal panda output.
  // In the consumer, we expose css via system/css.ts.
  if (sourcePath.startsWith('components/')) {
    return content.replace(
      /from\s+['"]@reference-ui\/core\/styled-system\/css['"]/g,
      "from '../css'"
    )
  }

  return content
}

/**
 * Core compilation logic. Pure - no filesystem access.
 * Returns in-memory BuildResult; CLI writes to disk.
 * When sourceFiles is provided, outputs full design system source; otherwise stub metadata only.
 */
export function compile(config: GenerateDesignSystemConfig): BuildResult {
  debugCompileStep('Received Config', config)

  const result: BuildResult = {
    files: new Map<string, string>(),
    metadata: {
      hash: '',
      tokensUsed: [],
      components: [],
    },
  }

  const sourceFiles = config.sourceFiles ?? {}

  // Copy-through: materialize the provided source files into the consumer system.
  // We intentionally do NOT forward core's css.ts stub or core's index.ts.
  for (const [sourcePath, content] of Object.entries(sourceFiles)) {
    debugCompileStep(`Processing File: ${sourcePath}`, sourcePath)

    const normalizedPath = sourcePath.replace(/\\/g, '/')

    if (normalizedPath === 'css.ts' || normalizedPath === 'index.ts') {
      continue
    }

    const rewritten = rewriteCoreImportsForConsumer(normalizedPath, content)
    result.files.set(normalizedPath, rewritten)
  }

  // Provide a real css() by re-exporting Panda's generated runtime.
  // styled-system is expected to be present (copied from core).
  result.files.set(
    'css.ts',
    [
      "export { css, cx, cva, sva } from './styled-system/css/index.js'",
      '',
    ].join('\n')
  )

  // Entry file for bundling.
  result.files.set(
    'index.ts',
    [
      '/**',
      ' * Reference design system - generated entry. Do not edit by hand.',
      ' */',
      "export { RefButton } from './components/Button.js'",
      "export type { ButtonVariant, ButtonSize, RefButtonProps } from './components/Button.js'",
      "export { tokens } from './tokens.js'",
      "export { defaultTheme, defaultStaticCss } from './panda-config.js'",
      "export { css, cx, cva, sva } from './css'",
      '',
    ].join('\n')
  )

  debugCompileStep('Generated Result', result)
  return result
}
