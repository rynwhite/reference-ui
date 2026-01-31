/**
 * Load reference-core as source.
 * Core is consumed without pre-bundling - semantics stay transparent.
 */
import { tokens } from '@reference-ui/core'
import { createPandaConfig } from './panda-config.js'

export function loadCore() {
  return {
    tokens,
    createPandaConfig,
  }
}
