# Architecture

## Goal

Glotterfly is intended to be a self-contained Manifest V3 webpage translator that sends only user-authorized page text directly from the user's browser to OpenAI through Sign in with ChatGPT (SIWC). There is no developer translation proxy in the target architecture.

## Trust boundaries

```text
webpage (hostile/untrusted)
  -> injected page/content logic (untrusted input collector)
  -> validated runtime protocol
  -> privileged extension runtime
       -> SIWC credentials (never exposed to page code)
       -> fixed OpenAI endpoints only
  -> validated model output
  -> safe DOM renderer using textContent
```

The privileged runtime must not accept arbitrary fetch URLs from page-controlled messages. OAuth credentials never cross into page code.

## Packages

- `auth-siwc`: OAuth transaction construction, PKCE, callback validation, DNR loopback interception primitives, token response validation, refresh serialization, and revocation plumbing. ID-token cryptographic validation is deliberately deferred to the SIWC spike and must use a reviewed JOSE dependency.
- `openai-transport`: fixed OpenAI model/Responses transport, structured errors, and SSE handling.
- `dom`: conservative readable-block discovery, segmentation, placeholder protection, ephemeral cache, dynamic-page observation, and non-destructive rendering.
- `translation`: provider interface, fake provider, context-aware batching, versioned prompt, result validation, and bounded concurrency.
- `protocol`: runtime message schemas at extension trust boundaries.
- `apps/extension`: WXT MV3 shell and UI entrypoints.

## Page access

Glotterfly uses `activeTab` plus `scripting` for manual translation. The translation script is an unlisted WXT entrypoint injected only after a user action. The bootstrap does not request `<all_urls>`.

## Credential storage

Production credential storage is unresolved by design. The SIWC feasibility spike may test `chrome.storage.session` for browser-session-only credentials because it is memory-backed across service-worker eviction, but that must not be described as production-compliant until OpenAI confirms the interpretation. `storage.local`, IndexedDB, CacheStorage, page storage, and sync storage are not acceptable token stores under the current design.

Ordinary non-secret settings may be stored in `storage.local`, including target language, display mode, selected model, opaque installation host identifier, and issued SIWC client identifier.

## Translation pipeline

```text
user activation
 -> discover readable semantic blocks
 -> filter editable/code/extension-owned content
 -> normalize and assign opaque IDs
 -> protect URLs/variables/placeholders
 -> context-aware batches
 -> provider
 -> validate exact IDs/placeholders
 -> memory cache
 -> render translated text non-destructively
```

Initial batching targets are conservative defaults, not vendor limits: about 12k source characters or 60 semantic blocks per batch with two concurrent requests.
