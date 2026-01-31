# Monorepos

**One repo = 1 reference.** One `reference.config.ts`, one `reference.tokens.ts`, one `.reference-ui/` (generated output). Config can live at repo root or in a package (e.g. `design-system`). We don't write into node_modules; we don't read Nx or workspace metadata. Keep it simple.

---

## Output and config

- **Output:** All generated output (styled-system, panda.css, knowledge base) goes in **`.reference-ui/`** next to `reference.config.ts`. Never node_modules.
- **Scope:** `reference.config.ts` defines what to scan via `projectPaths` (or `include`). Paths can be relative (e.g. `../app-web/src`) or absolute. Run `ref sync` (or `ref sync --watch`) from the directory that contains `reference.config.ts`.

---

## File structure

Config at root or in a package—your choice.

```
repo/
├── reference.config.ts      # or inside packages/design-system/
├── reference.tokens.ts
├── .reference-ui/           # generated output
├── package.json            # @reference-ui/cli, @reference-ui/system (root or in design-system pkg)
└── packages/
    ├── design-system/      # optional: put config here if you prefer
    ├── app-web/
    └── app-docs/
```

Apps that use the design system depend on the package that owns it (or `@reference-ui/system`) and resolve generated assets from that package's `.reference-ui/` (path mapping or package exports).

---

## Setting up with Nx

Nx users can wire this in themselves. We don't read nx.json.

1. **Add a target** for the project that has `reference.config.ts` (e.g. root or `design-system`):
   - `ref-sync`: run `ref sync`. Set `outputs: ["{projectRoot}/.reference-ui"]` so Nx caches and invalidates correctly.
   - `dev` (or a dedicated watch target): run `ref sync --watch` for local dev.

2. **App build/dev:** Have app targets `dependsOn` the ref-sync target (or run `ref sync` before build). For dev, run the ref-sync watch target and the app dev server in parallel (e.g. `nx run-many -t dev -p design-system,app-web`). The app's bundler should watch the design-system output (path mapping or workspace dep to `.reference-ui/`).

3. **Inputs:** For cache, include `reference.config.ts`, `reference.tokens.ts`, and the contents of `projectPaths` in the ref-sync target's inputs.

No magic. One repo, one reference; Nx handles ordering and cache via targets and dependsOn.
