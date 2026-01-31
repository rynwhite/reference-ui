import { cpSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const NODE_MODULES_REFERENCE_SYSTEM = 'node_modules/@reference/system'

function getSystemPackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference/system',
      version: '0.0.0-generated',
      description: 'Reference design system (generated)',
      type: 'module',
      main: './index.cjs',
      module: './index.mjs',
      types: './index.d.mts',
      exports: {
        '.': {
          import: { types: './index.d.mts', default: './index.mjs' },
          require: { types: './index.d.cts', default: './index.cjs' },
        },
      },
    },
    null,
    2
  )
}

/**
 * Copy .reference/dist to node_modules/@reference/system so imports "just work".
 * No vite config needed - standard Node.js resolution.
 */
export function copyToNodeModules(packageRoot: string): void {
  const distDir = resolve(packageRoot, '.reference/dist')
  const target = resolve(packageRoot, NODE_MODULES_REFERENCE_SYSTEM)

  if (!existsSync(distDir)) {
    throw new Error(
      `@reference-ui/cli: .reference/dist not found. Run sync to build first.`
    )
  }

  // Ensure @reference namespace exists
  mkdirSync(resolve(packageRoot, 'node_modules/@reference'), { recursive: true })

  // Copy dist contents
  cpSync(distDir, target, { recursive: true })

  // Write package.json so it's a valid Node package
  writeFileSync(resolve(target, 'package.json'), getSystemPackageJson(), 'utf-8')
}
