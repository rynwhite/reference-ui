# Reference CLI: Self-Contained Package Generation System

## Status: ✅ Fully Operational

We have successfully implemented a **self-generating package system** where the CLI is the only dependency consumers need.

## What We've Built

The Reference CLI is effectively a **mini package manager** specifically designed for our component system. It generates everything the consumer needs directly into their `node_modules` without relying on npm/pnpm/yarn to install our packages.

### Consumer Experience

**Before:**
```json
{
  "dependencies": {
    "@reference-ui/core": "workspace:*",
    "@reference-ui/system": "workspace:*", 
    "lit": "^3.2.0",
    "@lit/react": "^1.0.0"
  },
  "devDependencies": {
    "@reference-ui/cli": "workspace:*"
  }
}
```

**After:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@reference-ui/cli": "workspace:*"
  }
}
```

**One command:** `reference sync`

## How It Works

### 1. CLI as the Single Source
The CLI package includes all dependencies:
- `@reference-ui/core` (pre-built web components)
- `@reference-ui/system` (design tokens & Panda CSS config)
- `lit` (web component runtime)
- `@lit/react` (React bindings)

### 2. Generation Process

When `reference sync` runs:

1. **Panda CSS Codegen**
   - Scans consumer code for CSS usage
   - Generates `.reference/css/` with real `css()`, `cva()`, `cx()` functions
   - Generates `.reference/tokens/` with design tokens

2. **Build System Runtime** (`.reference/runtime/system/`)
   - Copies generated Panda CSS output
   - Creates package.json with proper exports
   - This becomes the real implementation of `@reference-ui/system`

3. **Build Core Runtime** (`.reference/runtime/core/`)
   - Copies pre-built component bundles from CLI's `node_modules/@reference-ui/core/dist`
   - Copies generated `styled-system/styles.css`
   - Writes package.json for `@reference/core`

4. **Generate node_modules Structure**
   ```
   node_modules/
   ├── @reference/
   │   └── core/                    # Generated components
   │       ├── node_modules/
   │       │   ├── @reference-ui/
   │       │   │   └── system/      # Symlink → .reference/runtime/system
   │       │   ├── lit/             # Symlink → CLI's node_modules/lit
   │       │   └── @lit/
   │       │       └── react/       # Symlink → CLI's node_modules/@lit/react
   │       ├── index.mjs
   │       ├── react.mjs
   │       └── styles.css
   └── @reference-ui/
       └── system/                   # Symlink → .reference/runtime/system (for top-level imports)
   ```

## The Upside

### 1. **Zero Dependency Hell**
- Consumers don't manage component library dependencies
- No version conflicts between lit, @lit/react, etc.
- Single source of truth (the CLI)

### 2. **Instant Customization**
- Components use consumer's Panda CSS config
- Scan consumer's code, generate exactly what's needed
- No pre-built theme packages

### 3. **Bundle Optimization**
- Only generates CSS for used components
- No unused design tokens in final bundle
- Vite/webpack can tree-shake effectively

### 4. **Atomic Updates**
- One CLI version controls everything
- No "update all packages" dance
- Reduces breaking change surface area

### 5. **CI/CD Simplicity**
- One `pnpm add @reference-ui/cli`
- One `reference sync` in build step
- Works identically across all environments

## Low-Level Requirements

### Node.js Runtime Layer
This system lives entirely in the **Node.js runtime**. Key requirements:

1. **File System Operations**
   - ✅ `fs.cpSync()` - Copy pre-built bundles
   - ✅ `fs.symlinkSync()` - Create package symlinks
   - ✅ `fs.existsSync()` - Check for packages
   - ✅ `fs.writeFileSync()` - Generate package.json files

2. **Path Resolution**
   - ✅ `path.resolve()` - Absolute path construction
   - ✅ `path.dirname()` - Navigate up directory tree
   - ✅ `import.meta.url` / `__dirname` - Locate CLI's own files
   - ✅ Follow symlinks to find actual package locations

3. **Module Resolution**
   - Must resolve from **CLI's node_modules**, not consumer's
   - Handle both npm/pnpm/yarn layouts
   - Support monorepo workspace:* dependencies

### Critical Implementation Details

#### 1. CLI Self-Location
```typescript
// Get CLI's installation directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const cliRoot = resolve(__dirname, '..') // dist → packages/reference-cli
```

**Why it matters:** We must copy from the CLI's `node_modules`, not the consumer's.

#### 2. Symlink Strategy
```typescript
// Inside @reference/core/node_modules for component imports
symlinkSync(systemRuntimePath, 'node_modules/@reference/core/node_modules/@reference-ui/system')

// At top-level for Vite/webpack to resolve
symlinkSync(systemRuntimePath, 'node_modules/@reference-ui/system')
```

**Why both:** Component bundles import from `@reference-ui/system/css`. Vite resolves from top-level `node_modules`.

#### 3. Package.json Generation
```typescript
{
  "name": "@reference/core",
  "exports": {
    ".": { "import": "./index.mjs" },
    "./react": { "import": "./react.mjs" },
    "./styles.css": "./styles.css"
  }
}
```

**Why it matters:** Tells Node/bundlers how to resolve imports from `@reference/core`.

## Making It Bulletproof

### 1. Cross-Platform File Paths
- ✅ Always use `path.resolve()`, never string concatenation
- ✅ Handle Windows backslashes vs Unix forward slashes
- ⚠️ Test on Windows CI (symlinks require admin/developer mode)

### 2. Package Manager Agnostic
```typescript
function findPackageDir(pkgName: string): string | null {
  // 1. Walk up consumer's node_modules
  // 2. Check CLI's own node_modules
  // 3. Check workspace packages (monorepo)
}
```

**Handles:**
- npm: flat node_modules
- pnpm: `.pnpm` store + symlinks
- yarn: hoisting + workspaces

### 3. Atomic Operations
```typescript
// WRONG: Partial state if interrupted
rmSync(target)
cpSync(source, target)

// RIGHT: Atomic swap
cpSync(source, tempTarget)
rmSync(target)
renameSync(tempTarget, target)
```

### 4. CI/CD Considerations

#### Must Work In:
- ✅ GitHub Actions (Linux)
- ✅ GitLab CI (Linux)
- ⚠️ CircleCI (needs testing)
- ⚠️ Windows CI (symlink permissions)
- ✅ Docker containers (no admin access)

#### Environment Checks:
```typescript
// Check if symlinks are supported
try {
  symlinkSync(source, target)
} catch (err) {
  // Fall back to copy
  cpSync(source, target, { recursive: true })
}
```

#### Permissions:
- Must work without `sudo`
- Must work in read-only filesystems (except consumer's package)
- Must work with `npm ci` (frozen lockfiles)

### 5. Dependency Isolation

**Problem:** Consumer's node_modules might have conflicting versions of lit/react/etc.

**Solution:** Nest dependencies under `@reference/core/node_modules/`
- Component bundles resolve from there first
- Consumer's versions don't interfere
- True dependency isolation

### 6. Cache Invalidation
```typescript
// Check if sync is needed
const lastSyncHash = readFileSync('.reference/.sync-hash')
const currentHash = hashFiles(['panda.config.ts', 'src/**/*.tsx'])

if (lastSyncHash !== currentHash) {
  runSync()
  writeFileSync('.reference/.sync-hash', currentHash)
}
```

### 7. Error Handling

#### Graceful Failures:
- Missing CLI dependencies → Clear error message
- Permission denied → Suggest workaround
- Partial sync → Clean up and retry

#### Validation:
```typescript
// After sync, verify structure
assert(existsSync('node_modules/@reference/core/index.mjs'))
assert(existsSync('node_modules/@reference-ui/system/css/css.js'))
assert(existsSync('.reference/runtime/system/package.json'))
```

## The Mini Package Manager

We're essentially building a **specialized package manager** for our component system:

| Traditional Package Manager | Reference CLI |
|----------------------------|---------------|
| Resolves from registry | Bundles packages |
| Installs to node_modules | Generates into node_modules |
| Manages versions | Single version (CLI) |
| Handles dependencies | Copies from CLI's deps |
| npm/pnpm/yarn | Works with all |

### What We're NOT Doing:
- ❌ Network requests (no registry)
- ❌ Version resolution (we control it)
- ❌ Dependency graphs (we know the structure)
- ❌ Lockfiles (CLI version is the lock)

### What We ARE Doing:
- ✅ Package layout (node_modules structure)
- ✅ Module resolution (symlinks + package.json)
- ✅ Dependency isolation (nested node_modules)
- ✅ Build orchestration (Panda CSS + bundling)

## Testing Strategy

### Unit Tests
- Path resolution across platforms
- Symlink creation (with fallback)
- Package.json generation
- Hash computation

### Integration Tests
```bash
# Test across package managers
npm install && reference sync
pnpm install && reference sync
yarn install && reference sync

# Test in CI environment
docker run --rm -v $(pwd):/app node:18 sh -c "cd /app && npm ci && reference sync"
```

### E2E Tests
```typescript
// Create temp consumer package
// Run reference sync
// Import components
// Verify they work
```

## Future Proofs

### 1. Multiple Runtimes
```typescript
// Support Bun, Deno
if (isBun) copyWithBun()
else if (isDeno) copyWithDeno()
else copyWithNode()
```

### 2. Offline Mode
```typescript
// Bundle everything in CLI's dist/
// No external dependencies
// Works air-gapped
```

### 3. Parallel Processing
```typescript
// Copy files in parallel
await Promise.all([
  copyCore(),
  copySystem(),
  copyLit(),
  copyLitReact()
])
```

### 4. Watch Mode
```typescript
// reference sync --watch
chokidar.watch('src/**/*.{ts,tsx}').on('change', () => {
  runPandaCodegen()
  buildSystemRuntime()
})
```

## Conclusion

✅ **Status:** Fully functional. The CLI generates all packages into `node_modules` without relying on traditional package installation.

🎯 **Core Principle:** Build on Node.js runtime primitives (fs, path, symlinks) that work across all environments.

🛡️ **Robustness:** Handle all package managers, all platforms, all CI environments by staying close to Node.js fundamentals.

🚀 **Benefit:** Consumers get a zero-dependency, auto-customizing component system with one `reference sync` command.
