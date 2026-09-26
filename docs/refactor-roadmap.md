# Refactor Roadmap

## Phase 0 — Repository Audit & Cleanup

**Goal:** Establish a trustworthy baseline and remove repository hygiene issues before implementation work begins.

**Belongs here:** Repository inventory, committed-artifact cleanup, architecture documentation, dependency and asset audits, baseline test/build results, and identification of cleanup candidates.

**Must not be mixed in:** Feature work, UI redesign, framework migration, TypeScript conversion, or broad architectural refactors.

## Phase 1 — Architecture Foundation

**Goal:** Introduce clear module boundaries that can support later migration without changing customer-facing behavior.

**Belongs here:** Feature boundaries, shared UI organization, domain-facing interfaces, repositories/services, removal of confirmed dead code, and incremental decomposition of oversized modules.

**Must not be mixed in:** Next.js adoption, wholesale TypeScript conversion, visual redesign, or new commerce capabilities.

## Phase 2 — Next.js Migration

**Goal:** Move the application from Create React App to the Next.js App Router while preserving behavior and visual output.

**Belongs here:** App Router structure, route migration, layouts, server/client boundaries, metadata integration, loading/error/not-found conventions, and framework-specific asset handling.

**Must not be mixed in:** Broad design-system changes, unrelated feature work, large domain rewrites, or complete TypeScript conversion.

## Phase 3 — TypeScript Migration

**Goal:** Add explicit, reliable types across the application and its commerce domain.

**Belongs here:** TypeScript configuration, staged JS/JSX conversion, product/cart/order/profile/variant types, typed service and repository contracts, and removal of unsafe implicit shapes.

**Must not be mixed in:** UI redesign, new business behavior, dependency churn, or unrelated architectural expansion.

## Phase 4 — Design System

**Goal:** Formalize the existing visual language into maintainable tokens and reusable primitives without changing brand direction.

**Belongs here:** Color, typography, spacing, motion, focus, breakpoint, and component tokens; foundational controls; and documented visual states.

**Must not be mixed in:** Marketing redesigns, new visual motifs, feature additions, or commerce/data-layer changes.

## Phase 5 — Data & Commerce Architecture

**Goal:** Separate commerce domain behavior from static data and UI concerns, with production-ready boundaries.

**Belongs here:** Product repositories, cart and order services, validation at boundaries, checkout contracts, persistence strategy, error handling, and a replaceable data-source layer.

**Must not be mixed in:** Page redesign, cosmetic polish, unrelated accessibility work, or speculative backend features.

## Phase 6 — UI/UX Refactor

**Goal:** Improve consistency and maintainability of existing journeys using the established design system and architecture.

**Belongs here:** Focused component refactors, consistent interaction states, responsive behavior, navigation and commerce journey refinements, and removal of duplicated presentation patterns.

**Must not be mixed in:** Unrequested rebranding, extra marketing sections, new product features, or data-layer redesign.

## Phase 7 — Accessibility & Form Validation

**Goal:** Make accessibility behavior and form validation consistent across all customer journeys.

**Belongs here:** Keyboard and focus behavior, dialog semantics, announcements, reduced motion, validation rules, field errors, submission states, and accessibility testing.

**Must not be mixed in:** Visual redesign, framework migration, unrelated content changes, or new commerce scope.

## Phase 8 — Performance & SEO

**Goal:** Improve delivery performance, discoverability, and route-specific metadata using measured changes.

**Belongs here:** Image optimization, font and bundle review, rendering strategy, route metadata, structured data, canonical URLs, crawl behavior, and measurable performance improvements.

**Must not be mixed in:** Feature development, design overhaul, speculative micro-optimizations, or unrelated refactors.

## Phase 9 — Testing

**Goal:** Establish a reliable, layered test strategy for domain logic and critical customer journeys.

**Belongs here:** Stable unit and integration coverage, route and commerce-flow tests, accessibility checks, test fixtures, CI execution, and removal of brittle or redundant tests.

**Must not be mixed in:** Product feature changes, UI redesign, framework migration, or production behavior changes solely to satisfy tests.

## Phase 10 — Production Polish

**Goal:** Close verified release gaps and prepare the application for production operation.

**Belongs here:** Final error/loading/empty-state review, observability hooks, deployment configuration, security and privacy checks, content QA, browser/device verification, and release documentation.

**Must not be mixed in:** Major migrations, broad architecture changes, new feature scope, or last-minute redesigns.
