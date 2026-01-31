import { cpSync, existsSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const REFERENCE_CORE_PKG = '@reference-ui/core'
const DOT_REFERENCE_RUNTIME_CORE = '.reference/runtime/core'
const NODE_MODULES_REFERENCE_CORE = 'node_modules/@reference/core'

/**
 * Resolve the path to @reference-ui/core's dist folder.
 * Looks in the CLI's own node_modules (the CLI depends on core, not the consumer).
 */
export function resolveCoreDistPath(): string {
  // __dirname will be /path/to/cli/dist after bundling (not dist/lib)
  const cliRoot = resolve(__dirname, '..')
  const distPath = resolve(cliRoot, 'node_modules', REFERENCE_CORE_PKG, 'dist')
  if (!existsSync(distPath)) {
    throw new Error(
      `@reference-ui/cli: Cannot find ${REFERENCE_CORE_PKG}/dist at ${distPath}. The CLI should include @reference-ui/core as a dependency.`
    )
  }
  return distPath
}

/**
 * Package.json written into .reference/runtime/core and node_modules/@reference/core
 * so that imports like @reference/core and @reference/core/react resolve correctly.
 */
function getRuntimePackageJson(): string {
  return JSON.stringify(
    {
      name: '@reference/core',
      version: '0.0.0-generated',
      description: 'Reference UI core components (generated)',
      main: './index.cjs',
      module: './index.mjs',
      types: './index.d.mts',
      exports: {
        '.': {
          import: { types: './index.d.mts', default: './index.mjs' },
          require: { types: './index.d.cts', default: './index.cjs' },
        },
        './react': {
          import: { types: './react.d.mts', default: './react.mjs' },
          require: { types: './react.d.cts', default: './react.cjs' },
        },
        './styles.css': './styles.css',
      },
      sideEffects: ['./styles.css'],
    },
    null,
    2
  )
}

/**
 * Copy pre-built component bundles from @reference-ui/core/dist to .reference/runtime/core.
 * Also copies the consumer's generated styles (styled-system/styles.css) as styles.css.
 * Writes package.json so the folder is a valid Node package.
 */
export function buildRuntimeToDotReference(packageRoot: string): void {
  const coreDistPath = resolveCoreDistPath() // Now resolves from CLI's node_modules
  const outDir = resolve(packageRoot, DOT_REFERENCE_RUNTIME_CORE)
  const stylesSource = resolve(packageRoot, 'styled-system/styles.css')

  mkdirSync(outDir, { recursive: true })

  // Copy entire core dist (index.*, react.*, chunk files)
  cpSync(coreDistPath, outDir, { recursive: true })

  // Copy generated Panda CSS from consumer into runtime as styles.css
  if (existsSync(stylesSource)) {
    cpSync(stylesSource, resolve(outDir, 'styles.css'))
  }

  writeFileSync(resolve(outDir, 'package.json'), getRuntimePackageJson(), 'utf-8')
}

/**
 * Build the @reference-ui/system package in .reference/runtime/system with generated Panda CSS.
 * This becomes the real implementation of css(), cva(), cx() that components import.
 */
export function buildSystemToDotReference(packageRoot: string): void {
  const systemDir = resolve(packageRoot, '.reference/runtime/system')
  
  if (existsSync(systemDir)) rmSync(systemDir, { recursive: true, force: true })
  mkdirSync(systemDir, { recursive: true })

  // Copy generated Panda CSS output
  const dotRefCss = resolve(packageRoot, '.reference/css')
  if (existsSync(dotRefCss)) {
    cpSync(dotRefCss, resolve(systemDir, 'css'), { recursive: true })
  }

  // Copy other generated artifacts that might be needed
  const helpers = resolve(packageRoot, '.reference/helpers.js')
  if (existsSync(helpers)) {
    cpSync(helpers, resolve(systemDir, 'helpers.js'))
  }

  // Write package.json for @reference-ui/system
  const systemPkg = {
    name: '@reference-ui/system',
    version: '0.0.0-generated',
    description: 'Reference UI design system (generated)',
    exports: {
      './css': {
        import: './css/index.js',
        require: './css/index.js',
      },
    },
  }
  writeFileSync(resolve(systemDir, 'package.json'), JSON.stringify(systemPkg, null, 2))
}

/**
 * Find a package by walking up node_modules hierarchy or checking workspace packages.
 * Also checks the CLI's own node_modules (where lit, @lit/react are installed).
 * Returns absolute path to the package directory, or null.
 */
function findPackageDir(packageRoot: string, pkgName: string): string | null {
  // First try consumer's node_modules
  let dir = resolve(packageRoot)
  while (true) {
    const candidate = resolve(dir, 'node_modules', pkgName)
    if (existsSync(candidate)) return candidate
    const parent = resolve(dir, '..')
    if (parent === dir) break
    dir = parent
  }

  // Try CLI's own node_modules (where lit and @lit/react are)
  const cliRoot = resolve(__dirname, '..')
  const cliCandidate = resolve(cliRoot, 'node_modules', pkgName)
  if (existsSync(cliCandidate)) return cliCandidate

  // Monorepo fallback: check workspace packages (workspace:* dependencies)
  if (pkgName.startsWith('@reference-ui/')) {
    const pkgShortName = pkgName.split('/')[1] // 'system' from '@reference-ui/system'
    const workspaceCandidate = resolve(packageRoot, '..', `reference-${pkgShortName}`)
    if (existsSync(workspaceCandidate)) return workspaceCandidate
  }

  return null
}

/**
 * Copy .reference/runtime/core to node_modules/@reference/core (atomic: remove then copy).
 * Then create node_modules/@reference/core/node_modules and populate it with the dependencies
 * that the bundle needs (@reference-ui/system, lit, @lit/react), copying or symlinking them.
 */
export function copyRuntimeToNodeModules(packageRoot: string): void {
  const source = resolve(packageRoot, DOT_REFERENCE_RUNTIME_CORE)
  const target = resolve(packageRoot, NODE_MODULES_REFERENCE_CORE)

  if (!existsSync(source)) {
    throw new Error(
      `@reference-ui/cli: .reference/runtime/core not found. Run sync to build runtime first.`
    )
  }

  mkdirSync(resolve(packageRoot, 'node_modules/@reference'), { recursive: true })
  rmSync(target, { recursive: true, force: true })
  cpSync(source, target, { recursive: true })

  const coreNodeModules = resolve(target, 'node_modules')
  mkdirSync(coreNodeModules, { recursive: true })

  // @reference-ui/system — use the generated runtime, not the stub package
  const systemRuntimePath = resolve(packageRoot, '.reference/runtime/system')
  if (existsSync(systemRuntimePath)) {
    // 1) Inside @reference/core/node_modules for the component bundles
    const refUiDir = resolve(coreNodeModules, '@reference-ui')
    mkdirSync(refUiDir, { recursive: true })
    const systemLink = resolve(refUiDir, 'system')
    if (!existsSync(systemLink)) {
      symlinkSync(systemRuntimePath, systemLink, 'dir')
    }

    // 2) At top-level node_modules/@reference-ui/system so Vite can resolve it
    const topLevelRefUiDir = resolve(packageRoot, 'node_modules/@reference-ui')
    mkdirSync(topLevelRefUiDir, { recursive: true })
    const topLevelSystemLink = resolve(topLevelRefUiDir, 'system')
    // Remove existing symlink or directory to ensure fresh link
    if (existsSync(topLevelSystemLink)) {
      rmSync(topLevelSystemLink, { recursive: true, force: true })
    }
    symlinkSync(systemRuntimePath, topLevelSystemLink, 'dir')
  }

  // lit
  const litPath = findPackageDir(packageRoot, 'lit')
  if (litPath) {
    const linkPath = resolve(coreNodeModules, 'lit')
    if (!existsSync(linkPath)) {
      symlinkSync(litPath, linkPath, 'dir')
    }
  }

  // @lit/react
  const litReactPath = findPackageDir(packageRoot, '@lit/react')
  if (litReactPath) {
    const atLitDir = resolve(coreNodeModules, '@lit')
    mkdirSync(atLitDir, { recursive: true })
    const reactLink = resolve(atLitDir, 'react')
    if (!existsSync(reactLink)) {
      symlinkSync(litReactPath, reactLink, 'dir')
    }
  }
}
