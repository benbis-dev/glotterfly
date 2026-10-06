# Development rules

Glotterfly is security-sensitive browser-extension code. These rules apply to human and AI-assisted changes.

## Hard constraints

- Never print, persist, commit, paste, or upload SIWC access tokens, refresh tokens, retained ID tokens, authorization codes, or full OAuth callback URLs.
- Never send real OAuth callback URLs into an AI coding assistant.
- Never put private webpage content, browsing history, or real user data into tests, issues, logs, analytics, or prompts to coding agents.
- Authentication work must be checked against current official OpenAI SIWC documentation before implementation or review.
- Content/page scripts must never receive OAuth tokens.
- Model/API output and webpage text are untrusted input.
- Never use `innerHTML` with translated, webpage-derived, or model-provided data.
- Do not add remote executable JavaScript or remotely hosted extension logic.
- New host permissions or extension permissions require security review and an update to `docs/permissions.md`.
- Do not copy source from OpenAI's noncommercial SIWC DevKit, Gloss/PolyForm code, AGPL projects, or other incompatible sources.
- Do not invent JWT/OIDC verification. Use a reviewed browser-compatible JOSE implementation when the SIWC spike reaches ID-token verification.
- Keep OpenAI API endpoints fixed in the privileged extension runtime; page-controlled messages must never supply arbitrary fetch URLs.

## Quality bar

- TypeScript strict mode and `noUncheckedIndexedAccess` remain enabled.
- Validate every trust boundary at runtime.
- Every inference request must support `AbortSignal` cancellation.
- Prompts are versioned in source.
- Add deterministic tests for security-sensitive behavior.
- Prefer small slices with explicit pass/fail gates.

## Current development gate

The current development gate is the SIWC feasibility spike in `docs/siwc-spike.md`.

Do not start full-page translation UX before the callback and session-storage policy questions are resolved enough to justify the architecture.

## Before commit

Run:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Never bypass a failing security test to land a feature.
