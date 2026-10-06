import { describe, expect, it } from "vitest";
import { parseAuthorizationCallback } from "../../packages/auth-siwc/src/callback";
import { DYNAMIC_AGENT_CLIENT_ID } from "../../packages/auth-siwc/src/constants";
import type { AuthorizationTransaction } from "../../packages/auth-siwc/src/transaction";

function transaction(clientId = DYNAMIC_AGENT_CLIENT_ID): AuthorizationTransaction {
  return {
    clientId,
    hostId: "urn:uuid:00000000-0000-4000-8000-000000000000",
    redirectUri: "http://127.0.0.1:53147/auth/callback",
    state: "state-state-state-state-state",
    nonce: "nonce-nonce-nonce-nonce-nonce",
    verifier: "v".repeat(64),
    challenge: "c".repeat(43),
    createdAt: 1,
  };
}

describe("SIWC callback validation", () => {
  it("requires state to match before returning a code", () => {
    expect(() =>
      parseAuthorizationCallback(
        "chrome-extension://example/oauth-callback.html?code=abc&state=wrong&client_id=issued",
        transaction(),
      ),
    ).toThrow("OAuth state mismatch");
  });

  it("accepts a new issued client id on first registration", () => {
    expect(
      parseAuthorizationCallback(
        "chrome-extension://example/oauth-callback.html?code=abc&state=state-state-state-state-state&client_id=issued-123",
        transaction(),
      ),
    ).toEqual({ code: "abc", issuedClientId: "issued-123" });
  });

  it("rejects a changed returning client id", () => {
    expect(() =>
      parseAuthorizationCallback(
        "chrome-extension://example/oauth-callback.html?code=abc&state=state-state-state-state-state&client_id=other",
        transaction("issued-123"),
      ),
    ).toThrow("Returning SIWC client_id changed unexpectedly");
  });
});
