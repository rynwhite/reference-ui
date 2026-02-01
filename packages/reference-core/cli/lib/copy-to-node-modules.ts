import { cpSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function getSystemPackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference-ui/system',
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

function getWebPackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference-ui/web',
      version: '0.0.0-generated',
      description: 'Reference web components',
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

function getReactPackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference-ui/react',
      version: '0.0.0-generated',
      description: 'Reference React bindings',
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
 * Copy reference-core dist/ to node_modules/@reference-ui with proper namespaces.
 * Creates @reference-ui/system, @reference-ui/web, @reference-ui/react.
 */
export function copyToNodeModules(packageRoot: string, coreDir: string): void {
  const distDir = resolve(coreDir, 'dist/src')

  if (!existsSync(distDir)) {
    throw new Error(
      `@reference-ui/core: dist/src not found. Build reference-core first.`
    )
  }

  // Ensure @reference-ui namespace exists
  mkdirSync(resolve(packageRoot, 'node_modules/@reference-ui'), { recursive: true })

  // Copy dist contents to @reference-ui/system
  const systemTarget = resolve(packageRoot, 'node_modules/@reference-ui/system')
  cpSync(distDir, systemTarget, { recursive: true })
  writeFileSync(resolve(systemTarget, 'package.json'), getSystemPackageJson(), 'utf-8')

  // Create @reference-ui/web as alias
  const webTarget = resolve(packageRoot, 'node_modules/@reference-ui/web')
  cpSync(distDir, webTarget, { recursive: true })
  writeFileSync(resolve(webTarget, 'package.json'), getWebPackageJson(), 'utf-8')

  // Create @reference-ui/react as alias
  const reactTarget = resolve(packageRoot, 'node_modules/@reference-ui/react')
  cpSync(distDir, reactTarget, { recursive: true })
  writeFileSync(resolve(reactTarget, 'package.json'), getReactPackageJson(), 'utf-8')
}
