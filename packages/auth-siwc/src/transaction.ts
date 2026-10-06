import { z } from "zod";
import { randomBase64Url } from "./base64url";
import { createPkce } from "./pkce";

export const authorizationTransactionSchema = z
  .object({
    clientId: z.string().min(1),
    hostId: z.string().min(1),
    redirectUri: z.url(),
    state: z.string().min(20),
    nonce: z.string().min(20),
    verifier: z.string().min(43),
    challenge: z.string().min(20),
    createdAt: z.number().int().nonnegative(),
  })
  .strict();

export type AuthorizationTransaction = z.infer<typeof authorizationTransactionSchema>;

export function randomLoopbackPort(): number {
  const random = crypto.getRandomValues(new Uint16Array(1))[0];
  if (random === undefined) throw new Error("Unable to generate loopback port");
  return 49_152 + (random % 16_384);
}

export function createHostId(): string {
  return `urn:uuid:${crypto.randomUUID()}`;
}

export async function createAuthorizationTransaction(
  clientId: string,
  hostId: string,
  port = randomLoopbackPort(),
): Promise<AuthorizationTransaction> {
  const { verifier, challenge } = await createPkce();
  return {
    clientId,
    hostId,
    redirectUri: `http://127.0.0.1:${String(port)}/auth/callback`,
    state: randomBase64Url(32),
    nonce: randomBase64Url(32),
    verifier,
    challenge,
    createdAt: Date.now(),
  };
}
