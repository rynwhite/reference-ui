# Reference UI CSS API

## Architecture Overview

Reference UI uses **Panda CSS** as its styling foundation, combining design tokens with a component-first approach optimized for web components.

### Key Principles

1. **Light DOM** - Components use Light DOM for natural CSS cascade
2. **Composable Elements** - Multi-part components (e.g., `ref-button`, `ref-button-label`, `ref-button-icon`)
3. **Variant-based Theming** - Variants are the primary mechanism for component-specific themes
4. **Token-based Design** - Most styling comes from design tokens; variants provide semantic presets

## Core APIs

### 1. The `css()` Function

The primary styling primitive from Panda CSS. Generates atomic CSS classes with design token support.

```typescript
import { css } from '@reference-ui/system'

const styles = css({
  backgroundColor: 'primary.500',
  padding: '4',
  borderRadius: 'md'
})
```

### 2. Design Tokens

Access design system tokens for colors, spacing, typography, etc.

```typescript
import { tokens } from '@reference-ui/system'

// Direct token access
tokens.colors.primary[500]
tokens.spacing[4]
tokens.radii.md
```

### 3. Utility Functions

```typescript
import { css, cx } from '@reference-ui/system'

// cx - Concatenate classNames
const combined = cx('base-class', styles, conditionalClass)
```

## Component Styling Patterns

### Attribute Selectors for Variants

Components expose variants through HTML attributes, following native web patterns.

```html
<!-- Usage -->
<ref-button variant="primary">Save</ref-button>
<ref-button variant="secondary">Cancel</ref-button>
<ref-button variant="outline">Reset</ref-button>
```

### Styling Components by Variant

#### Global Styles (panda.config.ts)

The most common way to theme components across your application:

```typescript
// panda.config.ts
export default defineConfig({
  globalCss: {
    // Default styles
    'ref-button': {
      padding: '2',
      borderRadius: 'md',
      display: 'flex',
      gap: '2',
      alignItems: 'center'
    },
    
    // Primary variant
    'ref-button[variant="primary"]': {
      backgroundColor: 'brand.primary',
      color: 'white',
      
      '& ref-button-label': {
        fontWeight: 'semibold',
        fontSize: 'md'
      },
      
      '& ref-button-icon': {
        color: 'white',
        width: '4',
        height: '4'
      }
    },
    
    // Secondary variant
    'ref-button[variant="secondary"]': {
      backgroundColor: 'gray.200',
      color: 'gray.800',
      
      '& ref-button-label': {
        fontWeight: 'medium'
      },
      
      '& ref-button-icon': {
        color: 'gray.600'
      }
    },
    
    // Outline variant
    'ref-button[variant="outline"]': {
      borderWidth: '1px',
      borderColor: 'gray.300',
      backgroundColor: 'transparent',
      
      '& ref-button-label': {
        color: 'gray.900'
      },
      
      '& ref-button-icon': {
        color: 'gray.700'
      }
    }
  }
})
```

#### Plain CSS (Alternative)

```css
/* theme.css */
ref-button[variant="primary"] {
  background-color: var(--colors-purple-600);
}

ref-button[variant="primary"] ref-button-label {
  color: white;
  font-weight: 600;
}

ref-button[variant="primary"] ref-button-icon {
  color: white;
}
```

```typescript
// Import in your app
import './theme.css'
```

### Component-Level Overrides

For one-off customizations, use `css()` with descendant selectors:

```typescript
import { css } from '@reference-ui/system'

// Custom styling for a specific button
const customButton = css({
  '& ref-button-label': {
    fontSize: 'xl',
    fontWeight: 'bold',
    letterSpacing: 'wide'
  },
  
  '& ref-button-icon': {
    width: '6',
    height: '6',
    color: 'brand.accent'
  }
})

// Apply via className
<ref-button className={customButton} variant="primary">
  <ref-button-label>Custom</ref-button-label>
  <ref-button-icon name="star" />
</ref-button>
```

### Combining Variants with Custom Styles

```typescript
// Base variant provides semantic defaults
<ref-button 
  variant="primary"           // Provides base primary styles
  className={customButton}    // Overrides specific parts
>
  <ref-button-label>Save Changes</ref-button-label>
</ref-button>
```

## Prepackaged Styles & Recipes

### Config Recipes (For Preset Variants)

Recipes provide prepackaged style variants that can be shared and distributed.

```typescript
// panda.config.ts
export default defineConfig({
  theme: {
    extend: {
      recipes: {
        customButton: {
          className: 'custom-button',
          base: {
            display: 'flex',
            gap: '2'
          },
          variants: {
            theme: {
              brand: {
                '& ref-button-label': {
                  color: 'brand.primary',
                  fontWeight: 'bold'
                },
                '& ref-button-icon': {
                  color: 'brand.accent'
                }
              },
              minimal: {
                '& ref-button-label': {
                  fontSize: 'sm',
                  fontWeight: 'normal'
                },
                '& ref-button-icon': {
                  width: '3',
                  height: '3'
                }
              }
            }
          }
        }
      }
    }
  }
})
```

```typescript
// Usage
import { customButton } from '@reference-ui/system/recipes'

<ref-button className={customButton({ theme: 'brand' })} variant="primary">
  <ref-button-label>Brand Button</ref-button-label>
</ref-button>
```

### CVA (Class Variance Authority) - Advanced

For power users who need runtime composition:

```typescript
import { cva } from '@reference-ui/system'

const buttonStyles = cva({
  base: {
    '& ref-button-label': {
      fontSize: 'md'
    }
  },
  variants: {
    emphasis: {
      high: {
        '& ref-button-label': {
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }
      },
      low: {
        '& ref-button-label': {
          fontWeight: 'normal',
          opacity: 0.8
        }
      }
    }
  }
})

<ref-button className={buttonStyles({ emphasis: 'high' })}>
  <ref-button-label>Important</ref-button-label>
</ref-button>
```

## Theming Strategy

### Token-Based Theming (Primary)

Most design system customization happens through tokens:

```typescript
// panda.config.ts
export default defineConfig({
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: {
            primary: { value: '#7C3AED' },
            secondary: { value: '#EC4899' }
          }
        }
      }
    }
  }
})
```

All components using `brand.primary` will automatically update.

### Variant-Based Theming (Component-Specific)

Variants provide **semantic presets** for component-specific theming:

```typescript
// Instead of remembering all the styles for a "destructive" button:
<ref-button variant="destructive">Delete</ref-button>

// vs manually styling:
<ref-button className={css({
  backgroundColor: 'red.600',
  color: 'white',
  _hover: { backgroundColor: 'red.700' },
  // ... many more properties
})}>Delete</ref-button>
```

**Variants are the coherent interface** for accessing predefined component themes.

## Exposing Variants to Users

### 1. Document Standard Variants

```typescript
// Standard variants all components should support:
type StandardVariant = 
  | 'primary'      // Main action
  | 'secondary'    // Secondary action
  | 'outline'      // Subtle action
  | 'ghost'        // Minimal action
  | 'destructive'  // Dangerous action
```

### 2. Allow Variant Override in globalCss

```typescript
// Users can redefine what 'primary' means for their brand
globalCss: {
  'ref-button[variant="primary"]': {
    backgroundColor: 'brand.purple',  // Not default blue
    '& ref-button-label': {
      fontWeight: 'extrabold'         // More emphasis
    }
  }
}
```

### 3. Provide Variant Composition

```typescript
// Users can create new variants by composing styles
globalCss: {
  // Custom variant using attribute selector
  'ref-button[variant="brand-special"]': {
    backgroundColor: 'brand.gradient',
    borderRadius: 'full',
    '& ref-button-label': {
      textTransform: 'uppercase',
      letterSpacing: 'wider'
    }
  }
}
```

## Best Practices

### ✅ Do

- Use variants for semantic component themes (`primary`, `destructive`, etc.)
- Override variants globally in `globalCss` for brand consistency
- Use tokens for all design values (colors, spacing, etc.)
- Style child components through parent attribute selectors
- Keep component internals simple with reasonable specificity

### ❌ Don't

- Mix BEM syntax with web components (use `ref-button-label`, not `.button__label`)
- Use inline styles for theming (prefer `className` or `globalCss`)
- Fight specificity with `!important` (indicates architecture issue)
- Create deeply nested component hierarchies
- Style the parent element from within itself (circular)

## Examples

### Complete Button Theme

```typescript
// panda.config.ts
export default defineConfig({
  globalCss: {
    // Base button styles
    'ref-button': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2',
      padding: '0',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 200ms',
      fontFamily: 'inherit'
    },
    
    // Primary variant
    'ref-button[variant="primary"]': {
      backgroundColor: 'purple.600',
      borderRadius: 'lg',
      paddingX: '4',
      paddingY: '2',
      
      _hover: {
        backgroundColor: 'purple.700',
        transform: 'translateY(-1px)'
      },
      
      '& ref-button-label': {
        color: 'white',
        fontWeight: 'semibold',
        fontSize: 'md'
      },
      
      '& ref-button-icon': {
        color: 'white',
        width: '5',
        height: '5'
      }
    },
    
    // Destructive variant
    'ref-button[variant="destructive"]': {
      backgroundColor: 'red.600',
      borderRadius: 'md',
      paddingX: '4',
      paddingY: '2',
      
      _hover: {
        backgroundColor: 'red.700'
      },
      
      '& ref-button-label': {
        color: 'white',
        fontWeight: 'bold'
      },
      
      '& ref-button-icon': {
        color: 'white'
      }
    },
    
    // Disabled state (all variants)
    'ref-button[disabled]': {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    
    // Size variants
    'ref-button[size="small"]': {
      paddingX: '3',
      paddingY: '1.5',
      
      '& ref-button-label': {
        fontSize: 'sm'
      },
      
      '& ref-button-icon': {
        width: '4',
        height: '4'
      }
    },
    
    'ref-button[size="large"]': {
      paddingX: '6',
      paddingY: '3',
      
      '& ref-button-label': {
        fontSize: 'lg'
      },
      
      '& ref-button-icon': {
        width: '6',
        height: '6'
      }
    }
  }
})
```

### Using Multiple Variants

```html
<!-- Combines variant and size -->
<ref-button variant="primary" size="large">
  <ref-button-label>Get Started</ref-button-label>
  <ref-button-icon name="arrow-right" />
</ref-button>

<!-- Combines variant with custom className -->
<ref-button 
  variant="destructive" 
  className={customStyles}
  size="small"
>
  <ref-button-label>Delete</ref-button-label>
</ref-button>
```

## Migration & Adoption

### From Other Systems

#### From Tailwind
```typescript
// Tailwind
<button className="bg-blue-500 text-white px-4 py-2 rounded">

// Reference UI
<ref-button variant="primary">
  <ref-button-label>Click</ref-button-label>
</ref-button>
```

#### From CSS Modules
```typescript
// CSS Modules
<button className={styles.button}>

// Reference UI - inline
<ref-button className={css({
  backgroundColor: 'primary.500',
  padding: '4',
  borderRadius: 'md'
})}>
```

## Performance Considerations

- **Atomic CSS** - Panda generates optimized atomic classes
- **JIT Generation** - Only used styles are generated (with config recipes)
- **Zero Runtime** - Most work done at build time
- **CSS Variables** - Tokens compile to CSS custom properties
- **Light DOM** - No Shadow DOM overhead for styling

## Debugging

### Inspecting Generated Styles

```bash
# See generated CSS
cat packages/reference-system/styled-system/styles.css

# Regenerate after config changes
pnpm panda codegen --clean
```

### Common Issues

**Styles not applying?**
- Check specificity (use browser dev tools)
- Verify Light DOM is enabled on component
- Ensure `panda codegen` ran after config changes

**Tokens not resolving?**
- Verify token exists in `reference.tokens.ts`
- Check import path (`@reference-ui/system`)
- Run `panda codegen` to regenerate types

## Summary

Reference UI's CSS API prioritizes:

1. **Simplicity** - Direct element selectors, no class naming conventions
2. **Composability** - Multi-part components, style child elements independently  
3. **Themability** - Variants as the primary theming interface
4. **Standards** - Web components + native CSS patterns
5. **DX** - Type-safe tokens, autocomplete, build-time generation

The combination of Panda CSS + web components + variant-based theming provides a powerful, flexible system that works with or without frameworks.
