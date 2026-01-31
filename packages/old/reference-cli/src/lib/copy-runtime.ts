import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
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
 * Copy .reference/runtime/core to node_modules/@reference/core atomically.
 * Creates node_modules/@reference/core/node_modules and copies all dependencies
 * (@reference-ui/system, lit, @lit/react) from CLI's bundled deps.
 * 
 * Uses atomic temp-then-rename to avoid partial states.
 * Pure copy-only approach: no symlinks, works everywhere.
 */
export function copyRuntimeToNodeModules(packageRoot: string): void {
  const source = resolve(packageRoot, DOT_REFERENCE_RUNTIME_CORE)
  const target = resolve(packageRoot, NODE_MODULES_REFERENCE_CORE)
  const tempTarget = resolve(packageRoot, `node_modules/@reference/.core-${Date.now()}`)

  if (!existsSync(source)) {
    throw new Error(
      `@reference-ui/cli: .reference/runtime/core not found. Run sync to build runtime first.`
    )
  }

  // Atomic: copy to temp, build complete structure, then swap
  mkdirSync(resolve(packageRoot, 'node_modules/@reference'), { recursive: true })
  cpSync(source, tempTarget, { recursive: true })

  // Build node_modules structure inside temp
  const tempCoreNodeModules = resolve(tempTarget, 'node_modules')
  mkdirSync(tempCoreNodeModules, { recursive: true })

  // @reference-ui/system — copy the generated runtime
  const systemRuntimePath = resolve(packageRoot, '.reference/runtime/system')
  if (existsSync(systemRuntimePath)) {
    const refUiDir = resolve(tempCoreNodeModules, '@reference-ui')
    mkdirSync(refUiDir, { recursive: true })
    cpSync(systemRuntimePath, resolve(refUiDir, 'system'), { recursive: true })
  }

  // lit — copy from CLI's bundled dependencies
  const litPath = findPackageDir(packageRoot, 'lit')
  if (litPath) {
    cpSync(litPath, resolve(tempCoreNodeModules, 'lit'), { recursive: true })
  }

  // @lit/react — copy from CLI's bundled dependencies
  const litReactPath = findPackageDir(packageRoot, '@lit/react')
  if (litReactPath) {
    const atLitDir = resolve(tempCoreNodeModules, '@lit')
    mkdirSync(atLitDir, { recursive: true })
    cpSync(litReactPath, resolve(atLitDir, 'react'), { recursive: true })
  }

  // Atomic swap: remove old, rename temp to target
  rmSync(target, { recursive: true, force: true })
  renameSync(tempTarget, target)

  // Top-level @reference-ui/system for Vite/webpack resolution
  const topLevelRefUiDir = resolve(packageRoot, 'node_modules/@reference-ui')
  mkdirSync(topLevelRefUiDir, { recursive: true })
  const topLevelSystemTarget = resolve(topLevelRefUiDir, 'system')
  rmSync(topLevelSystemTarget, { recursive: true, force: true })
  
  if (existsSync(systemRuntimePath)) {
    cpSync(systemRuntimePath, topLevelSystemTarget, { recursive: true })
  }
}
