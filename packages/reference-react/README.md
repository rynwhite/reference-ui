# @reference-ui/react

React component bindings for Reference UI.

## Installation

```bash
npm install @reference-ui/react
# or
pnpm add @reference-ui/react
# or
yarn add @reference-ui/react
```

## Usage

```tsx
import React from 'react';
import { RefButton } from '@reference-ui/react';

function App() {
  return (
    <div>
      <RefButton label="Click me" variant="primary" />
      <RefButton label="Secondary" variant="secondary" size="large" />
      <RefButton label="Outline" variant="outline" disabled />
    </div>
  );
}

export default App;
```

## Components

- `RefButton` - A simple button component with variants and sizes

## TypeScript

This package includes TypeScript definitions. All component props are fully typed.

```tsx
import { RefButtonProps, ButtonVariant } from '@reference-ui/react';

const variant: ButtonVariant = 'primary';
```

## License

MIT
