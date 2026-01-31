import { defineConfig } from '@pandacss/dev'
import { tokens as defaultTokens, defaultTheme, defaultStaticCss } from '@reference-ui/core'

export interface CreatePandaConfigOptions {
  cwd: string
  outDir: string
  include?: string[]
  tokens?: typeof defaultTokens
}

/**
 * Create a Panda CSS config for use by the CLI. The CLI runs codegen in the
 * consumer package with this config; output goes to the consumer's .reference/.
 */
export function createPandaConfig(options: CreatePandaConfigOptions) {
  const { outDir, include = [], tokens } = options
  const themeTokens = tokens ?? defaultTokens
  return defineConfig({
    preflight: true,
    include: include.length > 0 ? include : ['**/*.{ts,tsx}'],
    exclude: [],
    outdir: outDir,
    emitPackage: true as const,
    outExtension: 'js' as const,
    hash: false,
    jsxFramework: 'react',
    staticCss: defaultStaticCss,
    theme: {
      extend: {
        ...defaultTheme.extend,
        tokens: themeTokens,
      },
    },
  } as Parameters<typeof defineConfig>[0])
}
