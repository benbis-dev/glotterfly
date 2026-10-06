import { z } from "zod";
import { REQUIRED_DIRECT_SCOPE } from "./constants";

export const tokenResponseSchema = z.looseObject({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  id_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().positive(),
  scope: z.string().min(1),
  earliest_refresh_at: z.union([z.number(), z.string()]).optional(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;

export function grantedScopes(scope: string): ReadonlySet<string> {
  return new Set(scope.split(/\s+/u).filter(Boolean));
}

export function assertDirectInferenceScope(scope: string): void {
  if (!grantedScopes(scope).has(REQUIRED_DIRECT_SCOPE)) {
    throw new Error(`Missing required SIWC scope: ${REQUIRED_DIRECT_SCOPE}`);
  }
}
