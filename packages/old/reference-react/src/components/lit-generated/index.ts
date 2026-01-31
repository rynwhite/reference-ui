'use client';

/**
 * React wrappers for Reference UI Lit web components.
 * Uses @lit/react createComponent for correct prop and event handling.
 */

import React from 'react';
import { createComponent } from '@lit/react';
import { RefButton as RefButtonElement } from '@reference-ui/core';

export const RefButton = createComponent({
  tagName: 'ref-button',
  elementClass: RefButtonElement,
  react: React,
  events: {},
});
