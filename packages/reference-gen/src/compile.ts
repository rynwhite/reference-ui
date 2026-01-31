import type { BuildResult, GenerateDesignSystemConfig } from './types.js'
import { loadCore } from './load-core.js'

const CORE_CSS_IMPORT = /from\s+['"]@reference-ui\/core\/styled-system\/css['"]/g
const LOCAL_CSS_IMPORT = "from '../css.js'"

function rewriteCoreImports(content: string, filePath: string): string {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return content
  return content.replace(CORE_CSS_IMPORT, LOCAL_CSS_IMPORT)
}

function generateIndexTs(): string {
  return `/**
 * Reference design system - generated entry. Do not edit by hand.
 */
export { RefButton } from './components/Button.js'
export type { ButtonVariant, ButtonSize, RefButtonProps } from './components/Button.js'
export { tokens } from './tokens.js'
export { defaultTheme, defaultStaticCss } from './panda-config.js'
export { css } from './css.js'
`
}

function generatePackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference/system',
      version: '0.0.0-generated',
      type: 'module',
      private: true,
    },
    null,
    2
  )
}

function generateTsconfigJson(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'bundler',
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        declaration: true,
        declarationMap: true,
      },
      include: ['**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2
  )
}

/**
 * Core compilation logic. Pure - no filesystem access.
 * Returns in-memory BuildResult; CLI writes to disk.
 * When sourceFiles is provided, outputs full design system source; otherwise stub metadata only.
 */
export function compile(config: GenerateDesignSystemConfig): BuildResult {
  loadCore() // ensures core is loadable as source
  const tokensUsed = config.tokens ? ['custom'] : ['gray', 'primary']
  const components = config.components ?? ['RefButton']

  const files = new Map<string, string | Uint8Array>()

  if (config.sourceFiles && Object.keys(config.sourceFiles).length > 0) {
    for (const [path, content] of Object.entries(config.sourceFiles)) {
      const rewritten = rewriteCoreImports(content, path)
      files.set(path, rewritten)
    }
    files.set('index.ts', generateIndexTs())
    files.set('package.json', generatePackageJson())
    files.set('tsconfig.json', generateTsconfigJson())
  }

  files.set('metadata.json', JSON.stringify({ tokensUsed, components }, null, 2))

  const hash = config.sourceFiles
    ? `sys-${Date.now()}-${Array.from(files.keys()).sort().join(',').length}`
    : `stub-${Date.now()}`

  return {
    files,
    metadata: {
      hash,
      tokensUsed,
      components,
    },
  }
}
