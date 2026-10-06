# Glotterfly

Glotterfly is an open-source browser extension for translating webpages directly with a user's eligible ChatGPT plan. The intended product path uses OpenAI's Sign in with ChatGPT plan-sharing flow, not an API key and not a developer-hosted translation backend.

## Status

Pre-alpha bootstrap. The next engineering slice is a hard feasibility spike for browser-only Sign in with ChatGPT (SIWC): exact loopback callback interception with Manifest V3 declarativeNetRequest, token validation, model listing, and one streamed Responses request.

The repository deliberately does **not** claim that browser-only SIWC credential storage is production-approved. The spike may use `chrome.storage.session` only as an experimental, browser-session-only mechanism until OpenAI explicitly confirms that design is acceptable.

## Product constraints

- No `OPENAI_API_KEY` requirement.
- No developer translation backend in the target architecture.
- User-triggered page access via `activeTab`; no blanket `<all_urls>` permission by default.
- Content/page scripts never receive OAuth tokens.
- Remote/model output is untrusted data and is never rendered with `innerHTML`.
- Translation requests use `store: false` and `stream: true` on the SIWC route.
- Real SIWC credentials never enter CI, fixtures, logs, issues, or coding-agent context.
- OpenAI's noncommercial DevKit is behavioral documentation only; implementation here must be independent.

## Repository layout

```text
apps/extension/            WXT Manifest V3 extension shell
packages/auth-siwc/        SIWC transaction, PKCE, callback and token boundaries
packages/openai-transport/ Fixed OpenAI transport and SSE handling
packages/dom/              DOM discovery, segmentation, placeholders and safe rendering
packages/translation/      Provider, batching, prompt, validation and queueing
packages/protocol/         Runtime message schemas and trust-boundary validation
tests/                     Unit, integration, e2e, security and HTML fixtures
docs/                      Architecture, threat model, SIWC spike and release docs
```

## Development

Prerequisites: Git, Node.js 24 LTS (22.13+ is supported), Corepack/pnpm, Chrome Stable, and Chromium for Playwright. A ChatGPT Plus or Pro account is needed only for the manual/local SIWC smoke test.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm test:e2e
pnpm dev
```

To build directly into a directory that Chrome can load as an unpacked
extension, pass `--out-dir`:

```bash
pnpm build -- --out-dir /mnt/c/src/glotterfly-extension
```

The specified directory is the extension root and contains `manifest.json`
directly.

The same override works with the WXT development server:

```bash
pnpm dev -- --out-dir /mnt/c/src/glotterfly-extension
```

For a machine-local default, use `GLOTTERFLY_OUT_DIR`:

```bash
GLOTTERFLY_OUT_DIR=/mnt/c/src/glotterfly-extension pnpm dev
```

Relative output paths are resolved from the repository root. The custom
output directory must be a dedicated build directory; dangerous filesystem
and source-tree targets are rejected.

No live SIWC account is used in hosted CI. The automated suite uses synthetic OAuth/OpenAI fixtures.

## License

Apache-2.0. See [LICENSE](LICENSE).
