/**
 * Load reference-core as source.
 * Core is consumed without pre-bundling - semantics stay transparent.
 */
import { tokens, createPandaConfig } from '@reference-ui/core'

export function loadCore() {
  return {
    tokens,
    createPandaConfig,
  }
}
