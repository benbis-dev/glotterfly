import { describe, expect, it } from "vitest";
import { pkceChallengeForVerifier } from "../../packages/auth-siwc/src/pkce";

describe("PKCE", () => {
  it("matches the RFC 7636 S256 example", async () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    await expect(pkceChallengeForVerifier(verifier)).resolves.toBe(
      "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
    );
  });
});
