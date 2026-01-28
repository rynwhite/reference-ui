# Reference CLI

## Goal

**Zero-config setup.** Everything works on `npm install`.

---

## Post-Install Automation

When user installs `@reference-ui/system`:

1. Detects project structure
2. Generates `reference.tokens.ts` (if doesn't exist)
3. Generates `reference.config.ts` (if doesn't exist)
4. Runs initial Panda codegen
5. Updates TypeScript paths
6. Ready to use

**User does nothing.** System is configured.

---

## Core Command: `reference sync`

Scans the user's repo and syncs everything:

```bash
reference sync
```

**What it does:**
- Scans for `reference.tokens.ts` changes
- Scans for `reference.config.ts` changes
- Detects component usage in codebase
- Runs Panda codegen
- Updates TypeScript types
- Validates token references

---

## Watch Mode: `reference sync --watch`

Continuous sync during development:

```bash
reference sync --watch
```

**What it does:**
- Watches `reference.tokens.ts`
- Watches `reference.config.ts`
- Watches component files for token usage
- Auto-regenerates on any change
- Shows validation errors in real-time

---



```bash
reference export-token
```

**What it does:**
- exports tokens as a json
- reads config to check if user wishes to use reference standard tokens as part of their DS

