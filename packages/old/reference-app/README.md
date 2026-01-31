# Reference UI Test App

Simple Vite app to test the Reference UI CLI and component library integration.

## Purpose

This app validates:
- CLI can generate `.reference/` folder with Panda CSS output
- Core components load and work correctly
- Generated styles are imported and applied

## Run

```bash
pnpm dev
```

The CLI will run `reference sync` to generate styles, then start Vite dev server.
