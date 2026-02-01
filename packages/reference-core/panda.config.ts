import { defineConfig } from '@pandacss/dev'
import { defaultTheme, defaultStaticCss } from './src/tokens/index.js'

/**
 * Panda config for reference-core.
 * - codegen: emits src/system/ (css, recipes, tokens, types)
 * - cssgen: emits src/system/styles.css (preflight + tokens + static CSS)
 * Run: panda codegen (or --watch) and panda cssgen (or --watch).
 */
export default defineConfig({
  preflight: true,
  include: ['src/**/*.ts'],
  exclude: [],
  outdir: 'src/system',
  outExtension: 'js',
  hash: false,
  jsxFramework: 'react',
  staticCss: defaultStaticCss as unknown as Parameters<typeof defineConfig>[0]['staticCss'],
  theme: {
    extend: defaultTheme.extend,
  },
} as Parameters<typeof defineConfig>[0])
