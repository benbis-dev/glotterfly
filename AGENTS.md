# Glotterfly

Glotterfly is a security-sensitive Manifest V3 webpage translation extension.

## Where to go

- System architecture → `docs/architecture.md`
- Development and security rules → `docs/development-rules.md`
- Current SIWC feasibility slice → `docs/siwc-spike.md`
- Threat model → `docs/threat-model.md`
- Extension permissions → `docs/permissions.md`
- Privacy model → `docs/privacy.md`
- System/edit map → `map/CONTEXT.md`

## Source areas

- Browser extension runtime → `apps/extension/`
- SIWC and OAuth → `packages/auth-siwc/`
- Page discovery and rendering → `packages/dom/`
- OpenAI transport → `packages/openai-transport/`
- Runtime message protocol → `packages/protocol/`
- Translation pipeline → `packages/translation/`
- Tests and fixtures → `tests/`

## Before changing code

Read `docs/development-rules.md` and the documentation relevant to the area being changed.

The current development gate is the SIWC feasibility spike. Do not build full-page translation UX before that gate is resolved.
