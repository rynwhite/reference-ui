/**
 * Reference UI - React component bindings
 *
 * This package provides React wrappers for Reference UI web components.
 * Import from '@reference-ui/core/react' to use React components.
 */

import React from 'react';
import { createComponent } from '@lit/react';
import { RefButton as RefButtonElement } from './components/ref-button/ref-button';

export const RefButton = createComponent({
  tagName: 'ref-button',
  elementClass: RefButtonElement,
  react: React,
  events: {},
});

// Re-export types
export type { ButtonVariant, ButtonSize, RefButtonProps } from './components/ref-button/ref-button';
