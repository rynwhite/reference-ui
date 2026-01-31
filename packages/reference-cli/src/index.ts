#!/usr/bin/env node
/**
 * Reference CLI - execution and materialization layer.
 * Imports reference-gen, calls generateDesignSystem(), writes output to disk.
 */

import { syncCommand } from './commands/sync.js'

const args = process.argv.slice(2)
const command = args[0] ?? 'sync'
const cwd = process.cwd()

async function main(): Promise<void> {
  switch (command) {
    case 'sync':
      await syncCommand(cwd)
      break
    case 'build':
      await syncCommand(cwd)
      break
    default:
      console.log('Usage: reference <sync|build|dev>')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
