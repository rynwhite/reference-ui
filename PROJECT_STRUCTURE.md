# Reference UI - Project Structure Guide

This document provides detailed explanations of every file and directory in the Reference UI monorepo.

---

## Root Files

### Configuration Files

#### `package.json`
**Purpose:** Root workspace configuration and shared scripts

**Key Features:**
- Defines workspace-wide npm scripts (`dev`, `build`, `test`)
- Lists shared devDependencies (Nx, Storybook, TypeScript, etc.)
- Specifies package manager: `pnpm@10.28.2`
- Workspace definition: `packages/*`

**Scripts:**
```json
"dev": "nx run-many --target=dev --projects=reference-core,reference-storybook --parallel=2"
"build": "nx run-many --target=build --all"
```

---

#### `pnpm-workspace.yaml`
**Purpose:** Defines pnpm workspace packages

**Content:**
```yaml
packages:
  - 'packages/*'
```

**Why pnpm:**
- Faster installs than npm
- Disk-efficient (single copy of dependencies)
- Strict dependency isolation
- Better monorepo support

---

#### `pnpm-lock.yaml`
**Purpose:** Locked dependency versions for reproducible installs

**Features:**
- Ensures all developers use same package versions
- Committed to git for consistency
- Auto-generated, never edit manually

---

#### `nx.json`
**Purpose:** Nx workspace configuration

**Configures:**
- Task orchestration and dependencies
- Caching strategies
- Affected command behavior
- Default executors and targets

**Benefits:**
- Parallel task execution
- Smart build caching
- Only rebuild affected packages
- CI/CD optimization

---

#### `tsconfig.base.json`
**Purpose:** Base TypeScript configuration inherited by all packages

**Key Settings:**
- Compiler target (ES2020+)
- Module resolution strategy
- Path aliases for imports
- Strict type checking rules
- Declaration generation

**Why Base Config:**
- Single source of truth for TS settings
- Packages extend and override as needed
- Maintains consistency across monorepo

---

#### `.prettierrc`
**Purpose:** Code formatting rules

**Enforces:**
- Consistent code style
- Auto-formatting on save
- Reduces style debates in PRs

**Common Rules:**
- Single quotes
- Semicolons
- 2-space indentation
- Trailing commas

---

#### `.prettierignore`
**Purpose:** Files/folders Prettier should skip

**Typically Ignores:**
- `node_modules/`
- `dist/` or `build/`
- Generated files
- Lock files
- `.next/`, `.cache/`

---

#### `.gitignore`
**Purpose:** Files Git should not track

**Ignores:**
- `node_modules/`
- Build outputs (`dist/`, `www/`)
- `.env` files
- OS files (`.DS_Store`)
- IDE files (`.vscode/`, `.idea/`)
- Temporary files

---

### Documentation Files

#### `README.md`
**Purpose:** Project overview and quick start guide

**Contains:**
- Project description: "Knowledge-first UI component library"
- Current status (scaffolding phase)
- Monorepo structure overview
- Tech stack summary
- Links to detailed docs

**Audience:** First-time visitors, contributors

---

#### `ARCHITECTURE.md`
**Purpose:** High-level system design and architectural decisions

**Contains:**
- Top-level goals and objectives
- System architecture diagrams
- Package descriptions
- Key architectural decisions (why we made them)
- Data flow diagrams
- Technology stack
- Future roadmap

**Audience:** Architects, senior developers, contributors

---

#### `PROJECT_STRUCTURE.md` (this file)
**Purpose:** File-by-file reference guide

**Contains:**
- Explanation of every file and directory
- Purpose and responsibilities
- Usage examples
- Why each piece exists

**Audience:** New contributors, onboarding developers

---

#### `Plan.md`
**Purpose:** Implementation roadmap and TODOs

**Contains:**
- Phase-by-phase implementation plan
- Current progress
- Next steps
- Feature requirements

**Audience:** Core team, project managers

---

#### `cli.md`
**Purpose:** CLI tool usage and commands

**Contains:**
- `reference sync` command details
- `reference sync --watch` for dev mode
- Post-install automation
- Command-line options

**Audience:** CLI users, integration developers

---

#### `cli-to-system.md`
**Purpose:** How CLI integrates with design system

**Contains:**
- Dynamic node_modules patching strategy
- Code generation flow
- Edge cases and solutions (CI/CD, permissions, etc.)
- Safety checklist

**Audience:** Advanced users, system integrators

---

#### `core-system-cli.md`
**Purpose:** Design system configuration guide

**Contains:**
- `reference.tokens.ts` usage
- `createSystem()` vs `extendSystem()` explanation
- `reference.config.ts` options
- Token sync workflow

**Audience:** Design system consumers, frontend developers

---

## Packages Directory

### `packages/reference-cli/`
**Purpose:** Command-line tools for automation and code generation

**Status:** 🚧 Planned (scaffolding exists)

#### `Architecture.md`
**Purpose:** CLI-specific architectural decisions

**Will Contain:**
- File watching strategies
- Code generation logic
- AST parsing approach (SWC/Rust)
- Performance optimizations

---

### `packages/reference-core/`
**Purpose:** Core web components built with Stencil.js

**Exports:** Universal web components usable in any framework

#### `src/components/`
**Purpose:** Component implementations

**Structure:**
```
components/
└── ref-button/
    ├── ref-button.tsx        # Component logic
    ├── ref-button.css        # Component styles
    ├── readme.md             # Component documentation
    └── ref-button.spec.ts    # Unit tests (future)
```

**Component Pattern:**
- Each component in its own folder
- Co-located styles and docs
- Self-contained and testable

---

#### `src/components/ref-button/ref-button.tsx`
**Purpose:** Button component implementation

**Contains:**
- `@Component` decorator (Stencil config)
- Props with `@Prop()` decorators
- Event handlers with `@Event()`
- Render method (JSX)

**Example Structure:**
```typescript
@Component({
  tag: 'ref-button',
  styleUrl: 'ref-button.css',
  shadow: true,
})
export class RefButton {
  @Prop() variant: 'primary' | 'secondary';
  @Prop() size: 'sm' | 'md' | 'lg';
  
  render() {
    return <button class={this.variant}>
      <slot />
    </button>
  }
}
```

---

#### `src/components/ref-button/readme.md`
**Purpose:** Component-specific documentation

**Contains:**
- Usage examples
- Props reference
- Accessibility notes
- Design considerations

**Auto-generated By:** Stencil CLI

---

#### `src/components.d.ts`
**Purpose:** Auto-generated TypeScript definitions for all components

**Generated By:** Stencil compiler

**Contains:**
- Component interfaces
- Prop types
- Event types
- JSX intrinsic elements

**Do Not Edit:** Regenerated on every build

---

#### `src/index.ts`
**Purpose:** Public API entry point

**Exports:**
- All components
- Shared types
- Utility functions

**Usage:**
```typescript
export * from './components';
export { RefButton } from './components/ref-button/ref-button';
```

---

#### `reference-system/panda.css`
**Purpose:** Generated Panda CSS output

**Generated By:** Panda CSS codegen (future)

**Contains:**
- CSS utility classes
- Design token CSS variables
- Responsive styles
- Component styles

**Do Not Edit:** Auto-generated from `reference.tokens.ts`

---

#### `stencil.config.ts`
**Purpose:** Stencil build configuration

**Configures:**
- Output targets (web components, React, etc.)
- Build optimizations
- Development server settings
- Plugin integrations

**Key Settings:**
```typescript
export const config: Config = {
  namespace: 'reference-ui',
  outputTargets: [
    { type: 'dist' },
    { type: 'www' },
  ],
  plugins: [
    // Panda CSS integration (future)
  ]
}
```

---

#### `package.json`
**Purpose:** Package-specific configuration

**Key Fields:**
- `name`: `@reference-ui/core`
- `version`: Semantic version
- `main`: Entry point for Node.js
- `module`: ES module entry point
- `types`: TypeScript definitions location
- `dependencies`: Stencil, Panda CSS
- `scripts`: Build, dev, test commands

---

#### `project.json`
**Purpose:** Nx project configuration

**Defines:**
- Build targets (`build`, `dev`, `test`)
- Executor to use (Stencil executor)
- Input/output paths
- Cache settings
- Dependencies on other packages

**Example:**
```json
{
  "name": "reference-core",
  "targets": {
    "build": {
      "executor": "@nx/stencil:build",
      "options": {
        "configPath": "stencil.config.ts"
      }
    }
  }
}
```

---

### `packages/reference-react/`
**Purpose:** React bindings for Stencil components

**Exports:** React-compatible component wrappers

#### `src/components/stencil-generated/`
**Purpose:** Auto-generated React wrappers

**Generated By:** Stencil React output target

**Contains:**
- React component wrappers
- TypeScript definitions
- Event handler conversions
- Ref forwarding

**Example Output:**
```typescript
export const RefButton = createReactComponent<RefButtonProps>(
  'ref-button'
);
```

---

#### `src/components/stencil-generated/components.ts`
**Purpose:** Barrel export file for all React components

**Contains:**
```typescript
export { RefButton } from './ref-button';
export { RefInput } from './ref-input';
// ... all components
```

---

#### `src/index.ts`
**Purpose:** Public API for React package

**Exports:**
```typescript
export * from './components/stencil-generated';
```

**Usage:**
```typescript
import { RefButton } from '@reference-ui/react';
```

---

#### `example/App.tsx`
**Purpose:** Example React app for testing

**Contains:**
- Sample component usage
- Development playground
- Integration testing

**Usage:**
```bash
pnpm dev:react
# Opens example app with hot reload
```

---

#### `tsdown.config.ts`
**Purpose:** TypeScript bundler configuration

**Why tsdown:**
- Fast TypeScript bundling
- ESM/CJS dual output
- Declaration file generation
- Tree-shaking support

---

#### `package.json`
**Purpose:** React package configuration

**Key Dependencies:**
- `@reference-ui/core` (peer dependency)
- React (peer dependency)
- Build tools

**Scripts:**
- `build`: Generate React bindings
- `dev`: Watch mode for development

---

### `packages/reference-storybook/`
**Purpose:** Interactive component documentation

**Exports:** Storybook documentation site

#### `.storybook/main.ts`
**Purpose:** Storybook main configuration

**Configures:**
- Story locations (`src/**/*.stories.tsx`)
- Addons (controls, docs, a11y)
- Framework (React + Vite)
- Build settings

**Example:**
```typescript
export default {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
}
```

---

#### `.storybook/preview.ts`
**Purpose:** Global Storybook settings

**Configures:**
- Global decorators (wrapping all stories)
- Parameters (viewport, backgrounds)
- Theme customization
- Default args

**Example:**
```typescript
export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#fff' },
      { name: 'dark', value: '#333' },
    ],
  },
}
```

---

#### `.storybook/stencil-hmr-plugin.ts`
**Purpose:** Hot module reload integration for Stencil

**Why Needed:**
- Stencil web components need special HMR handling
- Ensures changes reflect immediately
- Prevents full page reloads

**How It Works:**
- Listens for Stencil file changes
- Invalidates component modules
- Triggers Vite HMR

---

#### `src/lib/RefButton.stories.tsx`
**Purpose:** Button component story

**Contains:**
- Component story definitions
- Interactive controls
- Usage examples
- Variations (primary, secondary, sizes)

**Example:**
```typescript
export default {
  title: 'Components/Button',
  component: RefButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
}

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
}
```

---

#### `package.json`
**Purpose:** Storybook package configuration

**Key Dependencies:**
- `@reference-ui/react` (uses React wrappers)
- Storybook core and addons
- Vite

**Scripts:**
- `dev`: Start Storybook dev server
- `build`: Build static Storybook site

---

### `packages/reference-system/`
**Purpose:** Design token system and Panda CSS configuration

**Exports:** Design tokens, styled-system utilities

#### `src/reference.tokens.ts`
**Purpose:** Default design token definitions

**Contains:**
- Color scales
- Spacing scales
- Typography tokens
- Border radius, shadows, etc.

**Example:**
```typescript
export const tokens = {
  colors: {
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      // ... more shades
      900: '#171717',
    },
    primary: {
      // brand colors
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
}
```

---

#### `src/index.ts`
**Purpose:** Public API for design system

**Exports:**
```typescript
export { tokens } from './reference.tokens';
export { createSystem, extendSystem } from './system';
export * from './styled-system'; // Generated by Panda
```

---

#### `panda.config.ts`
**Purpose:** Panda CSS configuration

**Configures:**
- Token sources (`reference.tokens.ts`)
- Output directory (`styled-system/`)
- Presets and themes
- Utility classes to generate
- JSX framework (React)

**Example:**
```typescript
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  theme: {
    extend: {
      tokens: {
        // ... token definitions
      },
    },
  },
})
```

---

#### `package.json`
**Purpose:** Design system package configuration

**Key Dependencies:**
- `@pandacss/dev` - Panda CSS codegen
- TypeScript

**Scripts:**
- `prepare`: Generate styled-system on install
- `dev`: Watch mode for token changes
- `build`: Generate production output

---

## User Configuration Files (Generated/User-Editable)

These files don't exist in the repo but are generated in user projects:

### `reference.tokens.ts` (User's Project)
**Purpose:** User's custom design tokens

**Created By:** CLI post-install hook

**User Edits:** Yes

**Example:**
```typescript
import { extendSystem } from '@reference-ui/system'

extendSystem({
  colors: {
    brand: {
      500: '#FF6B6B',
    },
  },
})
```

---

### `reference.config.ts` (User's Project)
**Purpose:** System-level configuration

**Created By:** CLI post-install hook

**User Edits:** Yes

**Options:**
```typescript
{
  useDefaultTokens: true,  // Include Reference UI defaults
  components: './src/components/**/*',  // Scan path
}
```

---

### `.reference/` (User's Project)
**Purpose:** CLI-generated knowledge base

**Created By:** `reference sync` command

**Contains:**
- Component API database
- Extracted TypeScript interfaces
- Token usage analysis
- Build cache

**Structure:**
```
.reference/
├── components/
│   └── button.json       # Extracted Button API
├── tokens/
│   └── usage.json        # Token usage stats
└── cache/
    └── ast-cache.json    # AST parsing cache
```

**Git:** Add to `.gitignore` (build artifact)

---

## Generated Files (Never Edit Manually)

### `node_modules/@reference-ui/system/styled-system/`
**Purpose:** Runtime-generated Panda CSS output

**Generated By:** `reference sync` command

**Contains:**
- `css.d.ts` - TypeScript definitions
- `jsx/` - JSX patterns
- `tokens/` - Token utilities
- `patterns/` - Style patterns

**Why In node_modules:**
- Invisible to user
- No workspace clutter
- Works like normal package
- TypeScript sees types automatically

---

### `dist/` or `www/` (Build Outputs)
**Purpose:** Compiled production code

**Generated By:** Build commands

**Location:** Inside each package

**Contains:**
- Bundled JavaScript
- Compiled CSS
- Type definitions
- Source maps

**Git:** Always ignored

---

## Summary

### Files You Edit Frequently:
- `packages/*/src/**/*.tsx` - Component implementations
- `packages/*/src/**/*.stories.tsx` - Storybook stories
- `reference.tokens.ts` - Design tokens (user projects)

### Files You Rarely Edit:
- `*.config.ts` - Configuration files
- `package.json` - Only for dependency updates
- `tsconfig.json` - Only for TS settings changes

### Files You Never Edit:
- `pnpm-lock.yaml` - Auto-generated
- `dist/` - Build outputs
- `styled-system/` - Code generation
- `components.d.ts` - Stencil output

---

**Last Updated:** January 28, 2026

**For More Info:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- [README.md](./README.md) - Quick start
- [Plan.md](./Plan.md) - Roadmap
