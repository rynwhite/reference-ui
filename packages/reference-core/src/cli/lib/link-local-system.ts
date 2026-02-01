import {
  existsSync,
  lstatSync,
  mkdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'

const SYSTEM_PACKAGE_JSON = `{
  "name": "@reference-ui/system",
  "version": "0.0.0-local",
  "private": true,
  "type": "module",
  "main": "./css/index.js",
  "types": "./css/index.d.ts",
  "exports": {
    ".": {
      "types": "./css/index.d.ts",
      "default": "./css/index.js"
    },
    "./css": {
      "types": "./css/index.d.ts",
      "default": "./css/index.js"
    },
    "./styles.css": "./styles.css"
  }
}
`

function findWorkspaceRoot(startDir: string): string | null {
  let current = startDir
  while (true) {
    if (existsSync(resolve(current, 'pnpm-workspace.yaml'))) {
      return current
    }
    const parent = resolve(current, '..')
    if (parent === current) return null
    current = parent
  }
}

export function linkLocalSystem(coreDir: string, cwd: string): void {
  if (coreDir.includes('/node_modules/')) return

  const workspaceRoot = findWorkspaceRoot(cwd) ?? findWorkspaceRoot(coreDir)
  if (!workspaceRoot) return

  const systemSource = resolve(coreDir, 'src/system')
  const systemTarget = resolve(workspaceRoot, 'node_modules/@reference-ui/system')

  mkdirSync(dirname(systemTarget), { recursive: true })

  if (existsSync(systemTarget)) {
    const stats = lstatSync(systemTarget)
    if (stats.isSymbolicLink() || stats.isDirectory()) {
      rmSync(systemTarget, { recursive: true, force: true })
    } else {
      return
    }
  }

  symlinkSync(systemSource, systemTarget, 'dir')
  writeFileSync(resolve(systemTarget, 'package.json'), SYSTEM_PACKAGE_JSON, 'utf-8')
}
