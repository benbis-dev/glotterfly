# Glotterfly system map

This map helps an agent understand what part of Glotterfly to inspect before making a change.

The source tree remains authoritative. The map points to source; it does not replace architecture or implementation documentation.

## Universes

- **live** — implemented and currently part of the intended system.
- **leftover** — still present but no longer the primary path.
- **ghost** — named, documented, or stubbed but not yet wired into the live system.

## How to use this map

1. Start with `objects/_index.md`.
2. Find the system object relevant to the change.
3. Read the authoritative source and documentation named there.
4. Do not infer implementation from the map alone.
5. Add detailed object or process cards only when the corresponding system is sufficiently stable to verify against source.

## Current state

Glotterfly is still in bootstrap and SIWC feasibility work.

Detailed process and change-impact maps do not exist yet because the live architecture is not mature enough to justify them.
