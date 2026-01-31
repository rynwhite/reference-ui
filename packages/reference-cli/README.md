# Reference CLI

The CLI invokes `reference-gen` to produce a design system and materializes it to `.reference/system/`, then bundles it with `tsdown` to `.reference/dist/`.

## Usage

```bash
ref sync    # Generate design system to .reference/
ref build   # Same as sync
```

## What it does

1. **Reads core source** - Loads TypeScript files from `@reference-ui/core`
2. **Calls gen** - `generateDesignSystem({ sourceFiles })` produces `BuildResult`
3. **Materializes to disk** - Writes files to `.reference/system/`
4. **Generates configs** - Creates `.reference/tsconfig.json` and `.reference/tsdown.config.ts`
5. **Bundles** - Runs `tsdown` in `.reference/` → outputs to `.reference/dist/`

## Output structure

```
.reference/
├── system/              # Design system source (from gen)
│   ├── index.ts
│   ├── components/
│   │   └── Button.ts
│   ├── tokens.ts
│   ├── panda-config.ts
│   └── css.ts
├── dist/                # Bundled output (from tsdown)
│   ├── index.mjs
│   ├── index.cjs
│   ├── index.d.mts
│   └── index.d.cts
├── tsconfig.json
└── tsdown.config.ts
```

## Key invariants

- **No package manager** - Direct file I/O and subprocess execution
- **No runtime imports** - Core source files read at build time, passed as strings
- **Self-contained** - CLI bundles all required dependencies (gen, tsdown, core)
- **Deterministic** - Same inputs → same outputs

## Integration

Apps import the bundled output:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@reference/system': path.resolve(process.cwd(), '.reference/dist/index.mjs'),
    },
  },
})

// main.tsx
import '@reference/system' // registers RefButton web component

// App.tsx
<ref-button label="Hello" />
```
