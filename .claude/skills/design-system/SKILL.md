---
name: design-system
description: >
  Establish and enforce a fixed design vocabulary — design tokens (color,
  spacing, typography, radius, shadow, motion), a spacing/type scale, and a
  reusable component library — so the agent assembles UI from a known set of
  primitives instead of inventing a new button, a new blue, or a new padding
  value every session. Use when building or touching UI, creating/editing
  components, choosing colors/spacing/typography, setting up a theme or tokens,
  or when asked to "make it look consistent / on-brand", "add a component",
  "style this". NOT about being a visual designer; it's about a shared,
  constrained vocabulary that keeps UI coherent across many sessions.
---

# Design system

The failure mode in AI-built UI isn't ugliness — it's *drift*. Session 1 makes
a button with `padding: 10px` and `#2b6cb0`. Session 2, with no memory of that,
makes one with `padding: 0.6rem` and `#3182ce`. Ten sessions later you have
nine blues and six buttons. The fix is a fixed vocabulary the agent must
assemble from, never extend ad hoc.

## Core rule

> Never introduce a raw value where a token exists. Never build a bespoke
> component where a library component (or a documented variant of one) exists.
> If the vocabulary is missing something, *add it to the system deliberately* —
> with a name — rather than inlining a one-off.

## The vocabulary (tokens)

Define these once, reference everywhere. Values are examples — set them to the
project's actual system if one exists (check for `tailwind.config`, a
`tokens.*`, a theme file, or CSS custom properties before inventing).

- **Spacing scale** — a small, fixed set. E.g. `2, 4, 8, 12, 16, 24, 32, 48, 64`.
  All margins/paddings/gaps come from this. No `13px`.
- **Type scale** — named sizes with paired line-heights and weights
  (`xs, sm, base, lg, xl, 2xl, …`). Body vs heading families defined once.
- **Color** — semantic, not literal. Define `--color-primary`, `--color-surface`,
  `--color-text`, `--color-muted`, `--color-border`, `--color-danger`,
  `--color-success`, plus their on-* pairs. Components reference *roles*
  (`text-danger`), never hex. Every foreground/background pair must meet WCAG
  AA contrast (4.5:1 body, 3:1 large/UI).
- **Radius, shadow/elevation, border width** — a fixed set of steps each.
- **Motion** — standard durations (`fast 120ms`, `base 200ms`) and easings;
  respect `prefers-reduced-motion`.
- **Breakpoints & z-index** — named, finite, documented.

Store them in one source of truth and expose them as the framework expects
(CSS custom properties, a theme object, Tailwind config). Light and dark are
two token sets, not one-off overrides.

## The component library

- Prefer composing existing components. Before creating one, search the repo
  for an existing equivalent (`Button`, `Card`, `Input`, `Modal`, `Badge`).
- Each component encodes the tokens so callers can't pass raw styling. Expose
  behavior through **named variants and props** (`variant="primary|ghost"`,
  `size="sm|md|lg"`), not through arbitrary `style`/`className` overrides.
- A component owns its states: default, hover, focus (visible ring!), active,
  disabled, loading, error, empty. A component that only has a default state is
  half-built.
- Accessibility is part of the component, not a later pass: semantic element or
  correct role, label, keyboard operability, focus management.

## Workflow when building UI

1. **Locate the system.** Is there a config/theme/token file? A component dir?
   Use it. If none exists and the task is more than a one-off, propose
   establishing the minimal token set first.
2. **Assemble from primitives.** Reach for existing tokens and components.
3. **When something is missing,** add it *to the system* with a name and the
   full set of states — then use it. Note the addition so
   [[context-engineering]] can record it.
4. **Verify:** contrast passes AA, spacing/type/color values all trace to
   tokens, dark mode works, focus is visible, layout survives 320px→wide and
   long/empty content.

## Anti-patterns

- Inline magic numbers (`margin-top: 17px`), one-off hex colors, ad-hoc shadows.
- A second component that does what an existing one does with slightly different
  padding — extend the variant, don't fork.
- `!important` and deep descendant overrides to fight the system instead of
  using it.
- Dark mode as an afterthought of inverted colors rather than a token set.
- Silent inconsistency: if you must deviate, say why, out loud.
