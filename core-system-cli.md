# Reference System CLI & Configuration

## Overview

Users configure their design system through two files:
1. `reference.tokens.ts` - Define or extend design tokens
2. `reference.config.ts` - System-level configuration

Both files are fully typed with autocomplete support.

---

## USER EXPERIENCE

### reference.tokens.ts

Users define their design tokens using two distinct functions:

```typescript
import { extendSystem, createSystem } from '@reference-ui/system'
```

---

#### createSystem()

**Define your own style tokens from scratch.**

```typescript
createSystem({
    colors: {
        N: {
            200: colors.myColor300
        }
    }
})
```

**What it does:**
- Lets you define a complete custom token set
- No Reference UI default tokens included
- Full control over token structure and naming conventions
- Panda CSS generates the styled-system from your tokens
- You define everything (colors, spacing, typography, etc.)

**Use case:**
- Custom design language with unique conventions
- Need specific token naming (e.g., "N" instead of "gray")
- Building a brand-specific token system
- Want minimal bundle (no unused default tokens)

---

#### extendSystem()

**Extends Reference UI's default token system.**

```typescript
// strictly typed against Reference UI tokens
extendSystem({
    grey: {
        300: colors.myColor300
    } 
})
```

**What it does:**
- Takes Reference UI defaults as the base
- Merges your custom tokens on top
- Strictly typed against existing token structure
- Autocomplete for available token paths (grey.100, grey.200, etc.)
- Only override specific tokens you need

**Use case:**
- Using Reference UI components
- Want established color/spacing scales
- Just need brand color customization
- Faster setup (defaults already configured)

---

### reference.config.ts

**System-level configuration:**

```typescript
{
    /* control whether you wish to expose default style system tokens in the styled system */
    useDefaultTokens: true
}
```

**Options:**

- `useDefaultTokens: true` - Include Reference UI's default tokens in the generated styled-system output
- `useDefaultTokens: false` - Exclude defaults, only generate user-defined tokens (smaller bundle)

**When to use `false`:**
- Using `createSystem()` with custom tokens
- Want minimal bundle size
- Don't need Reference UI component styles

**When to use `true`:**
- Using `extendSystem()`
- Want Reference UI components to work seamlessly
- Benefit from semantic token presets (colors.primary, spacing.md, etc.)

---


## Sync 

users will sync design tokens and knowledge base using reference sync command, or reference sync --watch.
