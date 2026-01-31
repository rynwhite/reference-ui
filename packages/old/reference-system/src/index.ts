/**
 * @reference-ui/system
 *
 * Panda CSS template for Reference UI: config factory + tokens.
 * The CLI uses this to prepare config; codegen runs in the consumer package
 * and writes to the consumer's .reference/ (no styled-system or panda.css here).
 */

export { createPandaConfig } from './create-panda-config'
export type { CreatePandaConfigOptions } from './create-panda-config'
export { tokens } from './reference.tokens'
