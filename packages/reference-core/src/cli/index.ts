#!/usr/bin/env node
/**
 * Reference Core CLI - thin build + materialize wrapper.
 * Builds reference-core source and materializes outputs to node_modules.
 * Run during postinstall and via ref-sync command.
 */

import { syncCommand } from './commands/sync.js'
import { linkSystemCommand } from './commands/link-system.js'

const cwd = process.cwd()

async function main(): Promise<void> {
  try {
    const [command] = process.argv.slice(2)
    if (command === 'link-system') {
      await linkSystemCommand(cwd)
      return
    }
    await syncCommand(cwd)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
