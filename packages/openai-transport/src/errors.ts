import { z } from "zod";

export const SIWC_ERROR_CODES = [
  "subscription_sharing_usage_limit_exceeded",
  "subscription_sharing_usage_unavailable",
  "subscription_sharing_unsupported_capability",
  "subscription_sharing_user_not_eligible",
] as const;

const errorBodySchema = z.looseObject({
  error: z
    .looseObject({
      code: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
});

export class OpenAITransportError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "OpenAITransportError";
  }
}

export async function errorFromResponse(response: Response): Promise<OpenAITransportError> {
  let code: string | undefined;
  let message = `OpenAI request failed with HTTP ${String(response.status)}`;
  try {
    const parsed = errorBodySchema.parse(await response.clone().json());
    code = parsed.error?.code;
    if (parsed.error?.message) message = parsed.error.message;
  } catch {
    // Preserve the status-only error when the response is not JSON.
  }
  return new OpenAITransportError(message, response.status, code);
}
