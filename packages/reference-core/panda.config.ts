import { defineConfig } from '@pandacss/dev'
import { defaultTheme, defaultStaticCss } from './src/panda-config.js'

/**
 * Panda config for reference-core.
 * - codegen: emits styled-system/ (css, recipes, tokens, types)
 * - cssgen: emits styled-system/styles.css (preflight + tokens + static CSS)
 * Run: panda codegen (or --watch) and panda cssgen (or --watch).
 */
export default defineConfig({
  preflight: true,
  include: ['src/**/*.ts'],
  exclude: [],
  outdir: 'styled-system',
  outExtension: 'js',
  hash: false,
  jsxFramework: 'react',
  staticCss: defaultStaticCss as unknown as Parameters<typeof defineConfig>[0]['staticCss'],
  theme: {
    extend: defaultTheme.extend,
  },
} as Parameters<typeof defineConfig>[0])
