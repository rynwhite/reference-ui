import { generateDesignSystem } from '@reference-ui/gen'

/**
 * reference sync - invokes compiler and materializes BuildResult to disk.
 * Stub: calls generateDesignSystem() and logs; actual filesystem writes TBD.
 */
export async function syncCommand(_cwd: string): Promise<void> {
  const result = generateDesignSystem({})
  console.log('reference sync (stub):', result.metadata)
  for (const [path, content] of result.files) {
    const preview = typeof content === 'string' ? content.slice(0, 60) + '...' : '<binary>'
    console.log('  ', path, '->', preview)
  }
}
