# @reference-ui/cli

Reference UI CLI for managing design tokens and system synchronization.

## Development

```bash
# Build the CLI
pnpm build:cli

# Watch mode (rebuild on changes)
pnpm dev:cli

# Test the CLI locally
node packages/reference-cli/dist/index.mjs

# Or directly execute
./packages/reference-cli/dist/index.mjs
```

## Build Configuration

This package uses **tsdown** for bundling:

- **Bundler**: tsdown (powered by rolldown/esbuild)
- **Output**: ESM + CJS with TypeScript declarations
- **Target**: Node.js 18+
- **Bundle**: All dependencies bundled (except Node.js built-ins)

See `tsdown.config.ts` for configuration.

## Package Structure

```
packages/reference-cli/
├── src/
│   ├── index.ts              # CLI entry point
│   └── lib/
│       └── reference-cli.ts  # Core CLI logic
├── dist/                     # Build output
│   ├── index.mjs            # ESM bundle (executable)
│   ├── index.cjs            # CJS bundle
│   └── *.d.ts               # Type declarations
├── package.json
├── project.json             # Nx configuration
├── tsconfig.json
└── tsdown.config.ts         # Build configuration
```

## Usage

Once published, users can install and use:

```bash
npm install -g @reference-ui/cli

# Run commands
reference sync
reference sync --watch
reference status
```

## Commands (Planned)

- `reference sync` - Sync tokens and generate system files
- `reference sync --watch` - Watch mode for continuous sync
- `reference status` - Check system status
- `reference validate` - Validate token configuration
- `reference export-token` - Export tokens as JSON

See `cli.md` and `cli-to-system.md` in the project root for architecture details.
