/**
 * Stub: the real css() is provided by the consumer's .reference/ after running
 * the CLI sync. This exists so packages that import @reference-ui/system/css
 * type-check; at runtime the consumer's bundler must resolve @reference-ui/system
 * to the consumer's .reference/ folder.
 */
export function css(..._args: unknown[]): string {
  throw new Error(
    "@reference-ui/system/css is provided by the consumer's .reference/ - run `reference-ui sync` (or prepare-reference) in the consumer package first."
  )
}

export function cx(..._args: unknown[]): string {
  throw new Error(
    "@reference-ui/system/css is provided by the consumer's .reference/ - run `reference-ui sync` first."
  )
}

export function cva(..._args: unknown[]): unknown {
  throw new Error(
    "@reference-ui/system/css is provided by the consumer's .reference/ - run `reference-ui sync` first."
  )
}
