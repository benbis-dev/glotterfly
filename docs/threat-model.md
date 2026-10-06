# Threat model

## Security objective

A malicious webpage may cause a bad translation, but it must not be able to steal SIWC credentials, turn Glotterfly into a cross-origin proxy, initiate unrelated AI work, render executable model output, or continue requests after explicit cancellation/logout.

## Protected assets

- SIWC access, refresh, and retained ID tokens.
- OAuth authorization codes, state, nonce, verifier, and issued client identifier.
- Private webpage content selected for translation.
- User intent: target language, page, operation lifetime, and cancellation state.

## Primary threats and controls

| Threat                           | Control                                                                                                  |
| -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Page steals credentials          | Tokens stay in privileged runtime; no token-bearing runtime messages to page/content code.               |
| OAuth CSRF/code substitution     | Fresh state, nonce, PKCE S256; exact callback validation; exact redirect URI reuse.                      |
| Broad loopback interception      | Exact random port/path session rule; high-priority rule removed on completion, cancellation, or timeout. |
| Prompt injection in webpage text | No model tools; fixed translation prompt; page text treated as data; strict result validation.           |
| Model returns markup/script      | Output rendered with DOM APIs and `textContent`; never trusted as HTML.                                  |
| Arbitrary cross-origin proxying  | Privileged runtime owns fixed OpenAI endpoints; message schemas contain no caller-supplied URL.          |
| Token refresh race               | Single-flight refresh coordinator and atomic token replacement in the spike.                             |
| Persistent private-page cache    | Bootstrap uses memory-only translation cache.                                                            |
| Hidden broad site access         | Manual `activeTab` activation; no default `<all_urls>`.                                                  |
| CI credential leakage            | CI uses only synthetic servers and fixtures. Real SIWC smoke tests are manual/local.                     |

## Explicit non-goals for bootstrap

- Persistent SIWC login across browser restarts.
- Automatic translation on all sites.
- Form fields, `contenteditable`, password/input surfaces, PDF, image/OCR, or subtitles.
- Analytics or advertising.
