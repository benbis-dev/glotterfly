import { randomBase64Url, toBase64Url } from "./base64url";

export async function pkceChallengeForVerifier(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return toBase64Url(new Uint8Array(digest));
}

export async function createPkce(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomBase64Url(48);
  return { verifier, challenge: await pkceChallengeForVerifier(verifier) };
}
