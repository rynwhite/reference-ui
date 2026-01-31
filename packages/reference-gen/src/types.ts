/**
 * In-memory build result. No filesystem writes.
 * CLI materializes this to disk.
 */
export interface BuildResult {
  files: Map<string, string | Uint8Array>
  metadata: {
    hash: string
    tokensUsed: string[]
    components: string[]
  }
}

export interface GenerateDesignSystemConfig {
  /** Optional token overrides (merged with core defaults) */
  tokens?: unknown
  /** Components to include (default: all from core) */
  components?: string[]
}
