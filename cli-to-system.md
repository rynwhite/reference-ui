# CLI to System Integration

## Dynamic node_modules Patching

**Goal:** Obfuscate codegen from the user. They never see generated files.

---

## The Flow

1. User edits `reference.tokens.ts`
2. `reference sync` runs (auto or manual)
3. CLI runs Panda codegen
4. **CLI writes generated output into `node_modules/@reference-ui/system`**
5. User imports normally: `import { css } from '@reference-ui/system'`

---

## What User Sees

```
project/
├── reference.tokens.ts    ✅ User edits this
├── reference.config.ts    ✅ User edits this
└── node_modules/
    └── @reference-ui/
        └── system/        ✅ CLI modifies this (invisible to user)
```

**No generated files in user's workspace.**

---

## What User Doesn't See

- `styled-system/` folder
- Panda codegen output
- Generated TypeScript types
- Intermediate build artifacts

**All generated code lives in node_modules.**

---

## How It Works

### On Post-Install
```bash
npm install @reference-ui/system
→ Post-install hook runs
→ CLI detects reference.tokens.ts (or creates default)
→ Runs initial codegen
→ Writes to node_modules/@reference-ui/system/styled-system/
```

### On Token Changes
```bash
User saves reference.tokens.ts
→ reference sync --watch detects change
→ Runs panda codegen
→ Patches node_modules/@reference-ui/system/styled-system/
→ TypeScript picks up new types
→ Components use new tokens immediately
```

---

## Benefits

**Clean workspace:**
- No generated files cluttering project
- Nothing to gitignore
- No confusion about what to edit

**Seamless imports:**
```typescript
import { css, button } from '@reference-ui/system'
// Works like any normal package
// User doesn't know it was just regenerated
```

**Type safety:**
- Generated types live in node_modules
- TypeScript sees them automatically
- Autocomplete just works

**Zero mental overhead:**
- User thinks it's a normal package
- Magic happens behind the scenes
- Codegen is invisible

---

## Technical Notes

**Patching node_modules:**
- CLI has write access to `node_modules/@reference-ui/system/`
- Regenerates `styled-system/` subfolder on sync
- Package.json exports point to generated files

**TypeScript integration:**
- Generated `.d.ts` files in node_modules
- TypeScript resolves them automatically
- No tsconfig changes needed

**Watch mode:**
- CLI watches user's `reference.tokens.ts`
- Debounces changes (avoid spam)
- Patches node_modules on every change
- Hot module reload picks up changes

---

## Edge Cases & Prevention

### 1. Fresh Install / Clean node_modules

**Problem:**
- `npm ci` or `pnpm install --frozen-lockfile` wipes node_modules
- Post-install might fail silently
- User gets broken imports

**Prevention:**
```json
// package.json
{
  "scripts": {
    "postinstall": "reference sync || echo '⚠️  Reference sync failed. Run: npx reference sync'",
    "prepare": "reference sync"
  }
}
```

**Belt-and-suspenders approach:**
- Post-install hook (runs on npm install)
- Prepare script (runs on git clone + install)
- Fallback error message if sync fails
- CI/CD explicitly runs `reference sync` after install

---

### 2. CI/CD Pipeline

**Problem:**
- CI caches node_modules
- Cached version missing generated files
- Build fails with "cannot find module"

**Prevention:**

**Option A: Always regenerate**
```yaml
# .github/workflows/ci.yml
- run: npm ci
- run: npx reference sync  # Explicit regeneration
- run: npm run build
```

**Option B: Cache key includes tokens**
```yaml
# Cache invalidates when tokens change
- uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml', 'reference.tokens.ts') }}
```

**Option C: Validate before build**
```json
// package.json
{
  "scripts": {
    "prebuild": "reference validate || reference sync"
  }
}
```

---

### 3. Monorepo Hoisting

**Problem:**
- Package manager hoists `@reference-ui/system` to root node_modules
- CLI can't find correct path to patch
- Multiple packages might need different tokens

**Prevention:**

**Lock package location:**
```yaml
# .npmrc (npm)
public-hoist-pattern[]=!@reference-ui/system

# .pnpmfile.cjs (pnpm)
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === '@reference-ui/system') {
        pkg.installConfig = { hoistingLimits: 'dependencies' }
      }
      return pkg
    }
  }
}
```

**Or: Workspace-specific config**
```
packages/
├── app-a/
│   ├── reference.tokens.ts
│   └── node_modules/@reference-ui/system/  # Own copy
└── app-b/
    ├── reference.tokens.ts
    └── node_modules/@reference-ui/system/  # Own copy
```

---

### 4. Package Manager Differences

**Problem:**
- npm, pnpm, yarn, bun handle post-install differently
- Symlinks vs hard copies
- Timing of hook execution

**Prevention:**

**Detect package manager:**
```javascript
// reference-cli/src/detect-pm.js
function detectPackageManager() {
  if (process.env.npm_config_user_agent?.includes('pnpm')) return 'pnpm'
  if (process.env.npm_config_user_agent?.includes('yarn')) return 'yarn'
  if (process.env.npm_config_user_agent?.includes('bun')) return 'bun'
  return 'npm'
}
```

**Resolve correct path:**
```javascript
// Handle pnpm symlinks
const systemPath = require.resolve('@reference-ui/system/package.json')
const systemDir = path.dirname(fs.realpathSync(systemPath))
```

**Test matrix:**
- Test post-install on npm, pnpm, yarn, bun
- Automated tests for each PM in CI

---

### 5. Concurrent Installs / Race Conditions

**Problem:**
- Multiple `npm install` running simultaneously (rare)
- Two processes try to write to node_modules
- File corruption or incomplete writes

**Prevention:**

**File locking:**
```javascript
import lockfile from 'proper-lockfile'

async function sync() {
  const release = await lockfile.lock('node_modules/@reference-ui/system')
  try {
    // Perform sync
  } finally {
    await release()
  }
}
```

**Atomic writes:**
```javascript
// Write to temp file, then rename (atomic operation)
fs.writeFileSync(tempFile, content)
fs.renameSync(tempFile, targetFile)
```

---

### 6. Version Mismatches

**Problem:**
- User has old `@reference-ui/system` installed
- CLI expects newer structure
- Sync writes to wrong location

**Prevention:**

**Version check:**
```javascript
const systemPkg = require('@reference-ui/system/package.json')
const cliPkg = require('@reference-ui/cli/package.json')

if (semver.lt(systemPkg.version, cliPkg.peerDependencies['@reference-ui/system'])) {
  throw new Error('Please update @reference-ui/system to match CLI version')
}
```

**Peer dependency enforcement:**
```json
// @reference-ui/cli package.json
{
  "peerDependencies": {
    "@reference-ui/system": "^1.0.0"
  },
  "peerDependenciesMeta": {
    "@reference-ui/system": {
      "optional": false
    }
  }
}
```

---

### 7. Permission Errors

**Problem:**
- Read-only file systems (Docker, some CI)
- Insufficient permissions to write node_modules
- Corporate proxies/security tools blocking writes

**Prevention:**

**Graceful degradation:**
```javascript
try {
  await writeToNodeModules()
} catch (error) {
  if (error.code === 'EACCES' || error.code === 'EROFS') {
    console.warn('Cannot write to node_modules. Falling back to .reference/')
    await writeToProjectDir()
  } else {
    throw error
  }
}
```

**Fallback location:**
```
project/
├── .reference/
│   └── styled-system/  # Fallback if node_modules fails
└── node_modules/
```

**Update imports to check both:**
```javascript
// @reference-ui/system/src/index.ts
try {
  export * from './styled-system'  // node_modules location
} catch {
  export * from '../../.reference/styled-system'  // fallback
}
```

---

### 8. Developer Experience Issues

**Problem:**
- Post-install spam in terminal
- Confusing error messages
- Silent failures

**Prevention:**

**Clear logging:**
```
✓ Reference tokens detected
✓ Running Panda codegen...
✓ Generated 47 token definitions
✓ Updated TypeScript types
✓ System ready
```

**Error messages with fixes:**
```
✗ Failed to generate tokens
  → reference.tokens.ts has syntax error on line 12
  → Fix: Remove trailing comma
  → Or run: npx reference validate
```

**Status command:**
```bash
npx reference status
# Output:
# ✓ Tokens:        Up to date
# ✓ Config:        Valid
# ✓ node_modules:  Synced 2 minutes ago
# ✓ Types:         Generated
```

---

## Safety Checklist

Before shipping:

- [ ] Post-install hook tested on npm, pnpm, yarn, bun
- [ ] CI/CD pipeline includes explicit `reference sync`
- [ ] Lockfile handles monorepo hoisting
- [ ] File locking prevents race conditions
- [ ] Version checks prevent mismatches
- [ ] Permission errors handled gracefully
- [ ] Clear error messages with solutions
- [ ] `reference status` command works
- [ ] Fallback to `.reference/` if node_modules fails
- [ ] Documentation includes troubleshooting section
