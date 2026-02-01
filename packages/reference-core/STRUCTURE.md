# reference-core Architecture & Plan

## Overview

**reference-core** is shipped as source code that gets built on the user's machine. This approach enables:
- Dynamic design system generation based on user projects
- Integration with PandaCSS for styling
- Future project scanning and code generation capabilities

## What reference-core Does

**Core Purpose:** Build a design system on-the-fly for users by generating three exportable packages:
- `@reference-ui/react` - React component library
- `@reference-ui/web` - Web components library  
- `@reference-ui/system` - Generated design system (via PandaCSS)

These packages are built into the user's `node_modules` for direct import and use.

## User Workflow

### Installation
```bash
npm install --save-dev @reference-ui/core
# or
pnpm add -D @reference-ui/core
```

### Commands
- **Build:** `ref sync` - Builds the design system and libraries
- **Development:** `ref sync --watch` - Watches for changes and rebuilds continuously

## Project Structure

**reference-core** contains everything needed to:
1. Compile source code
2. Generate PandaCSS configuration
3. Build and copy artifacts to user's node_modules
4. Provide importable packages

## Module Resolution

Both the reference-core repository and the user's generated code understand how to resolve imports from `@reference-ui/system` (the generated PandaCSS design system).

This ensures consistent imports across development and production environments.