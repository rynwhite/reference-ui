#!/usr/bin/env node
/**
 * Reference Core CLI - thin build + materialize wrapper.
 * Builds reference-core source and materializes outputs to node_modules.
 * Run during postinstall and via ref-sync command.
 */

import { syncCommand } from './commands/sync.js'

const cwd = process.cwd()

async function main(): Promise<void> {
  try {
    await syncCommand(cwd)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
