# Reference UI - Architecture Documentation

## Top-Level Goals

Reference UI is a **knowledge-first UI component library** that prioritizes developer experience through intelligent automation and seamless documentation.

### Core Objectives

1. **Zero-Config Setup** - Everything works automatically on `npm install`, no manual configuration required
2. **Invisible Code Generation** - Design tokens and types are generated dynamically without cluttering the user's workspace
3. **Automatic Documentation** - Component APIs, props, and usage are extracted and documented automatically
4. **Framework Agnostic** - Web components work everywhere, with first-class framework bindings
5. **Type-Safe Design System** - Full TypeScript support with autocomplete for design tokens and component props
6. **Live Code Examples** - Interactive component references with real-time editing and API exploration

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER PROJECT                         │
│  ┌──────────────────┐           ┌──────────────────┐        │
│  │ reference.       │           │ reference.       │        │
│  │ tokens.ts        │◄─────────►│ config.ts        │        │
│  └──────────────────┘           └──────────────────┘        │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          │                                   │
│                    ┌─────▼─────┐                             │
│                    │ reference │                             │
│                    │    CLI    │                             │
│                    └─────┬─────┘                             │
│                          │                                   │
│                          ▼                                   │
│              ┌───────────────────────┐                       │
│              │   node_modules/       │                       │
│              │   @reference-ui/      │                       │
│              │   system/             │◄──────────┐           │
│              │   ├── styled-system/  │ Generated │           │
│              │   └── types/          │ at Runtime│           │
│              └───────────────────────┘           │           │
│                          │                       │           │
└──────────────────────────┼───────────────────────┼───────────┘
                           │                       │
                           ▼                       │
┌─────────────────────────────────────────────────┼───────────┐
│                   REFERENCE UI PACKAGES         │           │
│                                                  │           │
│  ┌──────────────┐    ┌──────────────┐    ┌─────┴──────┐    │
│  │ @reference/  │    │ @reference/  │    │ @reference/│    │
│  │    core      │───►│    react     │    │   system   │    │
│  │  (Stencil)   │    │ (Bindings)   │    │  (Tokens)  │    │
│  └──────────────┘    └──────────────┘    └────────────┘    │
│         │                    │                               │
│         └────────────────────┼───────────────────────────┐   │
│                              │                           │   │
│                              ▼                           │   │
│                    ┌──────────────────┐                  │   │
│                    │  @reference/     │                  │   │
│                    │   storybook      │◄─────────────────┘   │
│                    │ (Documentation)  │                      │
│                    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
reference-ui/
├── packages/
│   ├── reference-cli/           # CLI automation tools
│   │   └── Architecture.md      # CLI-specific architecture docs
│   │
│   ├── reference-core/          # Stencil web components
│   │   ├── src/
│   │   │   ├── components/      # Component implementations
│   │   │   │   └── ref-button/
│   │   │   ├── components.d.ts  # Generated component types
│   │   │   └── index.ts         # Public API exports
│   │   ├── reference-system/
│   │   │   └── panda.css        # Generated Panda CSS output
│   │   ├── stencil.config.ts    # Stencil build configuration
│   │   ├── package.json
│   │   └── project.json         # Nx project configuration
│   │
│   ├── reference-react/         # React bindings for Stencil components
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   └── stencil-generated/  # Auto-generated React wrappers
│   │   │   └── index.ts         # Public API exports
│   │   ├── example/
│   │   │   └── App.tsx          # Example React app
│   │   ├── tsdown.config.ts     # TypeScript build config
│   │   ├── package.json
│   │   └── project.json         # Nx project configuration
│   │
│   ├── reference-storybook/     # Interactive documentation
│   │   ├── .storybook/
│   │   │   ├── main.ts          # Storybook configuration
│   │   │   ├── preview.ts       # Global decorators/parameters
│   │   │   └── stencil-hmr-plugin.ts  # Hot reload integration
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── RefButton.stories.tsx  # Component stories
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── project.json         # Nx project configuration
│   │
│   └── reference-system/        # Design token system
│       ├── src/
│       │   ├── reference.tokens.ts  # Default token definitions
│       │   └── index.ts         # Public API exports
│       ├── panda.config.ts      # Panda CSS configuration
│       ├── package.json
│       └── project.json         # Nx project configuration
│
├── .storybook/                  # Root Storybook config (if needed)
├── node_modules/
├── ARCHITECTURE.md              # This file - overall architecture
├── Plan.md                      # Implementation roadmap
├── cli.md                       # CLI usage documentation
├── cli-to-system.md             # CLI integration details
├── core-system-cli.md           # System configuration guide
├── PROJECT_STRUCTURE.md         # Detailed file-by-file guide
├── README.md                    # Project overview
├── package.json                 # Root workspace configuration
├── pnpm-workspace.yaml          # pnpm workspace definition
├── pnpm-lock.yaml               # Locked dependencies
├── nx.json                      # Nx workspace configuration
├── tsconfig.base.json           # Base TypeScript config
├── .prettierrc                  # Prettier formatting rules
└── .prettierignore              # Prettier ignore patterns
```

For detailed explanations of each file and directory, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

---

## Package Structure

### 1. **@reference-ui/system** - Design Token Foundation

**Purpose:** Manages design tokens, generates styled-system output

**Key Features:**
- User-defined tokens in `reference.tokens.ts`
- Two modes: `createSystem()` (custom) or `extendSystem()` (extends defaults)
- Panda CSS integration for type-safe styling
- Dynamic generation into `node_modules` (invisible to users)

**Public API:**
```typescript
import { css, button } from '@reference-ui/system'
```

**User Configuration:**
```typescript
// reference.tokens.ts
import { extendSystem } from '@reference-ui/system'

extendSystem({
  colors: {
    brand: {
      500: '#FF6B6B'
    }
  }
})
```

---

### 2. **@reference-ui/core** - Stencil Web Components

**Purpose:** Core UI components as framework-agnostic web components

**Key Features:**
- Built with Stencil.js for universal compatibility
- Type-safe props with TypeScript
- Automatically documented via CLI scanning
- Uses tokens from `@reference-ui/system`

**Component Structure:**
```typescript
@Component({
  tag: 'ref-button',
  styleUrl: 'ref-button.css',
})
export class RefButton {
  @Prop() variant: 'primary' | 'secondary';
  @Prop() size: 'sm' | 'md' | 'lg';
}
```

**Usage:**
```html
<ref-button variant="primary" size="md">Click me</ref-button>
```

---

### 3. **@reference-ui/react** - React Bindings

**Purpose:** Type-safe React wrappers for Stencil components

**Key Features:**
- Automatic React bindings generation
- Full TypeScript support
- Tree-shakeable exports
- React-specific optimizations (event handling, refs)

**Generated API:**
```typescript
import { RefButton } from '@reference-ui/react'

<RefButton variant="primary" onClick={handleClick}>
  Click me
</RefButton>
```

---

### 4. **@reference-ui/storybook** - Interactive Documentation

**Purpose:** Live component documentation and API reference

**Key Features:**
- Auto-generated component stories
- Interactive prop controls
- Live code editing
- API tables with all props/types
- Visual regression testing

**Magic Documentation:**
```tsx
<Reference.API name="ButtonProps">
// Renders complete API table with docs and variables
```

```tsx
<Reference.Code>
  <MyComponent />
</Reference.Code>
// Live editable code that just works
```

---

### 5. **@reference-ui/cli** - Automation Engine

**Purpose:** Zero-config setup and automatic synchronization

**Key Commands:**
- `reference sync` - One-time sync of tokens and types
- `reference sync --watch` - Continuous watch mode during development
- `reference export-tokens` - Export tokens as JSON
- `reference validate` - Validate token definitions

**Automation Features:**
- Post-install hook sets up everything automatically
- Scans codebase for TypeScript interfaces
- Generates `.reference/` knowledge base
- Patches `node_modules/@reference-ui/system` dynamically
- Updates TypeScript types on token changes

---

## Key Architectural Decisions

### 1. **Dynamic node_modules Patching**

**Problem:** Code generation creates clutter and confusion for developers

**Solution:** Generate all output directly into `node_modules/@reference-ui/system`

**Benefits:**
- Clean workspace (no `styled-system/` folders in user's code)
- Nothing to `.gitignore`
- Imports work like any normal package
- Zero mental overhead

**Implementation:**
```
user saves reference.tokens.ts
→ CLI watches and detects change
→ Runs Panda codegen
→ Writes to node_modules/@reference-ui/system/styled-system/
→ TypeScript picks up new types automatically
→ Hot reload triggers
```

---

### 2. **Knowledge-First Component API**

**Problem:** Component documentation becomes stale and requires manual maintenance

**Solution:** CLI scans codebase and extracts component APIs automatically

**Features:**
- Parses TypeScript interfaces from component files
- Stores in `.reference/` database
- Auto-generates API tables in Storybook
- Links props to design tokens
- Shows usage examples from actual codebase

**Future Enhancement (Rust/SWC):**
- Fast codebase scanning with SWC
- Compiled binary distribution via cargo-dist

---

### 3. **Two-Mode Token System**

**Problem:** Users need both flexibility (custom tokens) and convenience (defaults)

**Solution:** Two distinct functions with different guarantees

**`createSystem()` - Full Control:**
```typescript
createSystem({
  colors: { N: { 200: '#abc' } }
})
```
- No defaults included
- Custom token structure
- Minimal bundle size

**`extendSystem()` - Easy Start:**
```typescript
extendSystem({
  grey: { 300: '#custom' }
})
```
- Reference UI defaults as base
- Strictly typed against existing tokens
- Autocomplete support
- Override only what you need

---

### 4. **Zero-Config Philosophy**

**Problem:** Traditional design systems require extensive setup

**Solution:** Intelligent post-install automation

**On `npm install`:**
1. Detects if `reference.tokens.ts` exists
2. If not, generates sensible defaults
3. Runs initial Panda codegen
4. Configures TypeScript paths
5. System is ready to use

**Developer sees:**
```bash
npm install @reference-ui/system
✓ Reference tokens detected
✓ Generated 47 token definitions
✓ System ready
```

**No additional steps required.**

---

## Data Flow

### Token to Component Flow

```
User edits reference.tokens.ts
         │
         ▼
CLI detects change (watch mode)
         │
         ▼
Panda CSS codegen runs
         │
         ▼
Generates styled-system in node_modules
         │
         ▼
TypeScript types update
         │
         ▼
Stencil components import tokens
         │
         ▼
React bindings get type updates
         │
         ▼
Storybook reflects changes
         │
         ▼
User sees updated components with new tokens
```

---

### Component to Documentation Flow

```
Developer writes Stencil component
         │
         ▼
CLI scans for TypeScript interfaces
         │
         ▼
Extracts props, types, JSDoc comments
         │
         ▼
Stores in .reference/ database
         │
         ▼
Storybook reads from database
         │
         ▼
Auto-generates API tables
         │
         ▼
Creates interactive controls
         │
         ▼
Developer sees live documentation
```

---

## Technology Stack

### Core Technologies

| Package | Technology | Purpose |
|---------|-----------|---------|
| Monorepo | Nx | Workspace management, task orchestration |
| Components | Stencil.js | Web component compilation |
| Design System | Panda CSS | Type-safe styling, token generation |
| React Bindings | Stencil React | Automatic React wrapper generation |
| Documentation | Storybook 8 | Interactive component docs |
| CLI | Node.js | Automation and code generation |
| Package Manager | pnpm | Fast, disk-efficient installs |
| Build Tool | Vite | Fast development and bundling |
| Type Checking | TypeScript 5.9 | Type safety across packages |

### Future Technologies

- **Rust + SWC** - Fast codebase scanning for component API extraction
- **cargo-dist** - Binary distribution of CLI for improved performance

---

## Development Workflow

### For Library Developers (Internal)

```bash
# Install dependencies
pnpm install

# Start development servers (core + storybook)
pnpm run dev

# Build all packages
pnpm run build

# Run tests
pnpm run test
```

### For Library Users (External)

```bash
# Install Reference UI
npm install @reference-ui/system @reference-ui/react

# Edit tokens (if desired)
# File is auto-generated if it doesn't exist
vim reference.tokens.ts

# Start watch mode (runs automatically in dev)
npx reference sync --watch

# Use components
import { RefButton } from '@reference-ui/react'
```

---

## Future Roadmap

### Phase 1: Foundation (Current)
- ✅ Monorepo structure
- ✅ Stencil.js components
- ✅ Panda CSS integration
- ✅ Storybook setup
- 🚧 CLI with watch mode
- 🚧 Dynamic token generation

### Phase 2: Automation
- Component API scanning
- Knowledge base generation
- Auto-generated documentation
- Post-install automation
- Type safety validation

### Phase 3: Intelligence
- Usage analytics (which components/tokens are used)
- Dead code detection
- Automatic token optimization
- Bundle size analysis
- Performance monitoring

### Phase 4: Ecosystem
- Vue bindings
- Angular bindings
- Svelte bindings
- Figma token sync
- VSCode extension

### Phase 5: Performance
- Rust-based CLI (SWC scanning)
- Binary distribution
- Instant token updates
- Zero-overhead abstractions

---

## Edge Cases & Solutions

### Fresh Install / Clean node_modules
**Solution:** Multiple safety nets
- Post-install hook
- Prepare script for git clone
- Explicit CI/CD sync step
- Fallback error messages

### CI/CD Caching
**Solution:** Smart cache invalidation
- Cache key includes `reference.tokens.ts` hash
- Explicit `reference sync` in CI pipeline
- Pre-build validation

### Monorepo Hoisting
**Solution:** Package location locking
- Prevent hoisting via `.npmrc` or `.pnpmfile.cjs`
- CLI resolves real paths (handles symlinks)
- Workspace-specific token files

### Permission Errors
**Solution:** Graceful fallback
- Try writing to `node_modules`
- Fall back to `.reference/` folder
- Update imports to check both locations
- Clear error messages

---

## Security & Performance

### Security Considerations
- No credentials in token files
- CLI doesn't access network (except package install)
- File system access limited to project directory
- No arbitrary code execution

### Performance Optimizations
- Debounced file watching (avoid spam)
- Incremental token generation
- Lazy-loaded component bundles
- Tree-shakeable exports
- Atomic file writes (prevent corruption)

---

## Contribution Guidelines

### Adding New Components
1. Create component in `packages/reference-core/src/components/`
2. Add TypeScript interfaces with JSDoc
3. CLI automatically extracts API
4. Create story in `packages/reference-storybook/`
5. Run `pnpm run dev` to see live

### Modifying Token System
1. Update schema in `packages/reference-system/`
2. Regenerate types: `pnpm run build:system`
3. Test with both `createSystem()` and `extendSystem()`
4. Update documentation

### CLI Development
1. Modify code in `packages/reference-cli/`
2. Test post-install hook locally
3. Test watch mode with token changes
4. Validate on npm, pnpm, yarn, bun

---

## Success Metrics

### Developer Experience
- Time to first component: **< 5 minutes**
- Token changes to hot reload: **< 2 seconds**
- Setup steps required: **Zero**
- Documentation maintenance: **Automatic**

### Technical Metrics
- Bundle size: Minimal (tree-shakeable)
- Type safety: 100% coverage
- Build times: Fast (Vite + Nx caching)
- CI/CD reliability: 99.9%

---

## References

- [Stencil.js Documentation](https://stenciljs.com/)
- [Panda CSS Documentation](https://panda-css.com/)
- [Nx Monorepo Guide](https://nx.dev/)
- [Storybook Documentation](https://storybook.js.org/)

---

**Status:** 🚧 Active Development

**Current Phase:** Scaffolding and Foundation

**Last Updated:** January 28, 2026
