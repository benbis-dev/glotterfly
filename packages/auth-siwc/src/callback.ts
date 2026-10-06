import { z } from "zod";
import { DYNAMIC_AGENT_CLIENT_ID } from "./constants";
import type { AuthorizationTransaction } from "./transaction";

const callbackQuerySchema = z
  .object({
    code: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    client_id: z.string().min(1).optional(),
    error: z.string().min(1).optional(),
    error_description: z.string().optional(),
  })
  .strict();

export interface ParsedAuthorizationCallback {
  code: string;
  issuedClientId: string;
}

export function parseAuthorizationCallback(
  callbackUrl: string,
  transaction: AuthorizationTransaction,
): ParsedAuthorizationCallback {
  const url = new URL(callbackUrl);
  if (url.origin !== "null" && url.protocol !== "chrome-extension:") {
    throw new Error("OAuth callback must be handled by an extension page");
  }

  const parsed = callbackQuerySchema.parse(Object.fromEntries(url.searchParams.entries()));
  if (parsed.error) {
    throw new Error(
      parsed.error_description ? `${parsed.error}: ${parsed.error_description}` : parsed.error,
    );
  }
  if (!parsed.state || parsed.state !== transaction.state) throw new Error("OAuth state mismatch");
  if (!parsed.code) throw new Error("OAuth callback is missing code");

  if (transaction.clientId === DYNAMIC_AGENT_CLIENT_ID) {
    if (!parsed.client_id || parsed.client_id === DYNAMIC_AGENT_CLIENT_ID) {
      throw new Error("First SIWC registration did not return an issued client_id");
    }
    return { code: parsed.code, issuedClientId: parsed.client_id };
  }

  if (parsed.client_id && parsed.client_id !== transaction.clientId) {
    throw new Error("Returning SIWC client_id changed unexpectedly");
  }

  return { code: parsed.code, issuedClientId: transaction.clientId };
}
