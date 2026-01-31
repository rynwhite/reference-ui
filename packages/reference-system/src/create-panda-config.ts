import { defineConfig } from '@pandacss/dev'
import { tokens as defaultTokens } from './reference.tokens'

export interface CreatePandaConfigOptions {
  /** Working directory (e.g. consumer package root); used by CLI when running panda */
  cwd: string
  /** Output directory for generated code (e.g. '.reference') */
  outDir: string
  /** Glob patterns to scan for Panda usage (relative to cwd or absolute) */
  include?: string[]
  /** Optional token overrides (replaces default tokens) */
  tokens?: typeof defaultTokens
}

const defaultStaticCss = {
  css: [
    {
      properties: {
        backgroundColor: ['primary.50', 'primary.100', 'primary.200', 'primary.300', 'primary.400', 'primary.500', 'primary.600', 'primary.700', 'primary.800', 'primary.900', 'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500', 'gray.600', 'gray.700', 'gray.800', 'gray.900', 'transparent', 'white', 'black'],
        color: ['primary.500', 'primary.600', 'primary.700', 'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500', 'gray.600', 'gray.700', 'gray.800', 'gray.900', 'white', 'black'],
        borderColor: ['primary.500', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500'],
      },
    },
    {
      properties: {
        padding: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingLeft: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingRight: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingTop: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingBottom: ['1', '1.5', '2', '3', '4', '6', '8'],
        margin: ['0', '1', '2', '3', '4'],
        gap: ['1', '2', '3', '4'],
      },
    },
    {
      properties: {
        fontSize: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
        fontWeight: ['normal', 'medium', 'semibold', 'bold'],
      },
    },
    {
      properties: {
        borderRadius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
        borderWidth: ['0', '1px', '2px'],
      },
    },
  ],
}

const defaultTheme = {
  extend: {
    tokens: defaultTokens,
    recipes: {
      button: {
        className: 'button',
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'medium',
          borderRadius: 'md',
          transition: 'all',
          cursor: 'pointer',
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        variants: {
          variant: {
            primary: {
              bg: 'primary.500',
              color: 'white',
              _hover: { bg: 'primary.600' },
            },
            secondary: {
              bg: 'gray.200',
              color: 'gray.800',
              _hover: { bg: 'gray.300' },
            },
            outline: {
              borderWidth: '1px',
              borderColor: 'gray.300',
              bg: 'transparent',
              _hover: { bg: 'gray.50' },
            },
          },
          size: {
            sm: { px: 3, py: 1.5, fontSize: 'sm' },
            md: { px: 4, py: 2, fontSize: 'md' },
            lg: { px: 6, py: 3, fontSize: 'lg' },
          },
        },
        defaultVariants: {
          variant: 'primary',
          size: 'md',
        },
      },
    },
  },
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
