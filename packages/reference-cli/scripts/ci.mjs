#!/usr/bin/env node
/**
 * CI script: run reference sync for the default consumer (reference-storybook).
 * Run from repo root: node packages/reference-cli/scripts/ci.mjs
 * Or from reference-cli: node scripts/ci.mjs
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runSync } from '../dist/index.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cliRoot = resolve(__dirname, '..')
const defaultConsumer = resolve(cliRoot, '..', 'reference-storybook')
const consumerPath = process.argv[2] ? resolve(process.cwd(), process.argv[2]) : defaultConsumer

const { ok, packageRoot } = runSync(consumerPath)
if (!ok) {
  process.exit(1)
}
console.log(`CI: synced .reference/ in ${packageRoot}`)
process.exit(0)
