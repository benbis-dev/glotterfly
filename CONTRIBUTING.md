# Contributing

Glotterfly welcomes focused bug fixes, tests, documentation improvements, and well-scoped features.

## Development process

1. Open or reference an issue for non-trivial behavior changes.
2. Keep changes small enough to review as one security boundary or product slice.
3. Add or update tests before requesting review.
4. Run `pnpm check` and `pnpm test:e2e` where Chromium is available.
5. Sign commits with a DCO sign-off: `git commit -s`.

## Commit messages

Glotterfly uses Conventional Commits as its release/version contract.

- `fix:` produces a patch release.
- `feat:` produces a minor release.
- An intentional breaking Conventional Commit produces a major release.
- `ci:`, `chore:`, `docs:`, and `test:` normally do not produce a release.

Semantic-release owns product versioning. Do not manually bump release versions.

## Security and privacy

Do not include credentials, OAuth callback URLs, real private webpage content, browsing data, or account data in commits, issues, screenshots, fixtures, or CI. Reproduce site problems with synthetic HTML fixtures.

Changes touching auth, extension permissions, message routing, token handling, model transport, or safe DOM rendering require additional security review.

Do not copy code from source-available/noncommercial projects or copyleft dependencies unless the project has deliberately accepted the applicable obligations. New dependencies require a license and security review.

For vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than opening a public issue.
