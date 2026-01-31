/**
 * Load reference-core as source.
 * Core is consumed without pre-bundling - semantics stay transparent.
 * This is a validation check - actual source files are passed via config.sourceFiles.
 */
export function loadCore() {
  // Validation stub - core source is passed explicitly via sourceFiles config
  return {
    tokens: {},
    createPandaConfig: () => ({}),
  }
}
