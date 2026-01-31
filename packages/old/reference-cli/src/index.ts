import { resolve } from 'node:path'
import { runSync } from './lib/sync.js'

export * from './lib/reference-cli'
export { runSync } from './lib/sync.js'

const args = process.argv.slice(2)
if (args[0] === 'sync') {
  const cwd = args[1] ? resolve(process.cwd(), args[1]) : undefined
  const { ok, packageRoot } = runSync(cwd)
  if (!ok) {
    process.exit(1)
  }
  console.log(`Synced .reference/ and node_modules/@reference/core in ${packageRoot}`)
  process.exit(0)
}
