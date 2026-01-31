reference-gen
Reference Gen

The Reference Gen is the engine of the system.

It takes a fixed design system program and a set of inputs (tokens, options) and produces a fully materialised design system as build output.

Responsibilities

Owns the compile step

Integrates Panda CSS code generation

Applies design tokens to the Reference system

Generates:

CSS

component bundles

runtime helpers

package layouts

Produces output in memory, not on disk

DOES NOT BUILT TO ESM.

Core API
generateDesignSystem(config) → BuildResult


Where BuildResult is a pure, deterministic representation of the generated system (files, metadata, hashes).

Key invariants

No filesystem access

No environment awareness

No CLI flags

No side effects

What it is not

❌ A CLI

❌ A runtime

❌ A package manager

❌ A consumer-facing API

Mental model

The gen defines how a design system is built — never where or when.
