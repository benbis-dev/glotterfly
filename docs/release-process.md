# Release process

## Pull requests

CI must use a frozen dependency lockfile and run formatting, linting, TypeScript checks, unit/integration/security tests, Chromium extension tests, and a production build. No real SIWC credentials are allowed in GitHub Actions.

Conventional Commits are the product-version contract:

- `fix:` → patch;
- `feat:` → minor;
- intentional breaking Conventional Commit → major;
- `ci:`, `chore:`, `docs:`, `test:`, and similar maintenance commits normally do not release.

Semantic-release owns the Glotterfly product version. Release versions must not be bumped manually.

The checked-in product-version surfaces are:

- root `package.json`;
- `apps/extension/package.json`.

The generated browser manifest derives its version from the extension package during the WXT build. Internal private workspace packages are not automatically versioned with the product release.

## Automated release

Pushes to `main` run a separate Release workflow.

The workflow:

1. installs the frozen dependency graph;
2. independently runs the normal verification and Chromium extension tests;
3. configures SSH signing for generated release commits;
4. runs semantic-release;
5. synchronizes the checked-in product-version surfaces;
6. creates a signed release commit when a release is due;
7. creates the semantic version tag and GitHub Release.

Release commits use the GitHub-account identity associated with the registered SSH signing key and include a DCO `Signed-off-by` trailer.

The bootstrap `v0.0.0` tag is created manually as a signed annotated tag on the new parentless root. Semantic-release creates subsequent normal release tags.

## Release candidate

Before publishing an extension build as a reviewed distributable artifact:

1. Review dependency/license changes.
2. Review manifest permission diffs.
3. Run the full automated suite from a clean checkout.
4. Build the Chrome MV3 artifact.
5. Perform the real SIWC smoke test locally with a dedicated test account; never paste callback URLs or tokens into issues/chat/CI.
6. Verify logout/revocation, cancellation, browser restart, and plan-limit UX.
7. Compare the built artifact with the reviewed source/release commit.
8. Update privacy and permission disclosures when behavior changes.

Release artifacts must not contain secrets, remote executable code, source maps with sensitive build paths, or development-only OAuth diagnostics.

Extension artifact publication is not automated by the initial semantic-release setup. A GitHub Release created by semantic-release is therefore a source/version release marker, not by itself approval of a browser-extension artifact for distribution.
