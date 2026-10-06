# Privacy design draft

This is an engineering draft, not the final store privacy policy.

## Purpose

Glotterfly translates webpage text only after user authorization/activation.

## Website content

Readable page text needed for translation is extracted locally and, when translation is enabled, sent directly from the user's browser to OpenAI. It is incorrect to claim that translated page content never leaves the computer.

The target architecture has no developer translation backend and therefore does not route page text through a Glotterfly-operated inference server.

## OpenAI behavior

The SIWC route is intended to use the public Responses API with `store: false` and `stream: true`. This transport setting must not be expanded into unsupported claims about OpenAI's broader retention or data practices.

## Credentials

Production SIWC credential storage is unresolved. The experimental spike may hold credentials only for the browser session; final user-facing privacy text must match the implementation actually shipped.

## Local non-secret data

The extension may persist target language, translation mode, selected model, opaque installation host identifier, issued SIWC client identifier, and explicit site preferences. The initial translation cache is memory-only.

## Analytics and ads

The initial preview has no analytics and no advertising. Page text, translations, browsing history, auth/account identity, and sensitive URLs must not be used for advertising or telemetry.
