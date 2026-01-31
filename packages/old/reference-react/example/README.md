# Reference React Example

This example demonstrates how to use the `@reference-ui/react` components in a React application.

## Component Features

The example showcases:
- **Button Variants**: Primary, secondary, and outline styles
- **Button Sizes**: Small, medium, and large
- **Disabled State**: All variants can be disabled
- **TypeScript Support**: Full type definitions for all props

## Usage

```tsx
import React from 'react';
import { RefButton } from '@reference-ui/react';

function MyComponent() {
  return (
    <div>
      <RefButton label="Click me" variant="primary" size="medium" />
      <RefButton label="Secondary" variant="secondary" />
      <RefButton label="Disabled" disabled />
    </div>
  );
}
```

## TypeScript

The component exports TypeScript interfaces:

```tsx
import type { ButtonVariant, ButtonSize, RefButtonProps } from '@reference-ui/react';

const variant: ButtonVariant = 'primary'; // 'primary' | 'secondary' | 'outline'
const size: ButtonSize = 'medium'; // 'small' | 'medium' | 'large'
```

## Props Interface

```typescript
interface RefButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  label: string;
}
```
