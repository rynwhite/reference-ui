
# Mission Statement

- we need a cli tool which builds up knowledge and codegens on itself.
- internal api which just runs on the reference-ui project which builds default knowledgebase and codegen css.
- public facing api to extend what's already there internally.

- @reference-ui/system will be the foundation of this knowledgebase. the cli will just have scripts to perform AST, scan files and bring things into the system.

## Monorepos

- **One repo = 1 reference.** One config, one `.reference-ui/` output. Config can be at repo root or in a package (e.g. design-system). We don't write to node_modules; we don't read Nx.
- **Output in `.reference-ui/` only.** All generated output lives next to `reference.config.ts`. Run `ref sync` from that directory.
- **Config-driven scope.** `reference.config.ts` defines paths to scan (`projectPaths` or `include`). Paths can point to sibling packages etc.
- **Nx.** We don't integrate with Nx. Users add a target that runs `ref sync` (and optionally `ref sync --watch` for dev), set outputs/inputs for cache, and use dependsOn for app builds. Guidance in monorepos.md.


internal CLI:


```
ref internal 
```

- gateway to internal api.
- I think it's cleaner just to make reference-cli dual purpose in that sense.



```
ref internal sync
```
- extracts files containing @reference-ui. 
- copies them to folder within reference-system
- instructs reference-system to run panda-codegen






Public CLI:



note: we will take config from reference.config.ts.

```
ref sync
```

- Resolves config root (cwd or first ancestor with `reference.config.ts`). Scans paths from config (`projectPaths` or `include`); can be monorepo (e.g. design-system lib with paths to sibling packages). Builds knowledge base once, writes to `.reference-ui/` at config root only. No node_modules mutation.


```
ref sync --watch
```

- same as ref sync but with watch capabilities.



scans the current repo for typescript interfaces on components specified in a certain folder (in reference.config.ts)
creates a database in `.reference-ui/` (at config root), of the interfaces
nice clean schema. i guess.






RUST (MUCH LATER)
swc: use this to scan codebase properly
cargo-dist: use this to compile rust

