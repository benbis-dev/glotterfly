import { z } from "zod";
import { errorFromResponse } from "./errors";

const modelsResponseSchema = z.looseObject({
  data: z.array(z.looseObject({ id: z.string().min(1) })),
});

export interface OpenAIClientOptions {
  accessToken: string;
  apiBaseUrl?: string;
  fetchImpl?: typeof fetch;
}

export async function listModels(
  options: OpenAIClientOptions,
  signal?: AbortSignal,
): Promise<string[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.openai.com/v1";
  const response = await fetchImpl(`${apiBaseUrl}/models`, {
    headers: { Authorization: `Bearer ${options.accessToken}` },
    ...(signal !== undefined ? { signal } : {}),
  });
  if (!response.ok) throw await errorFromResponse(response);
  return modelsResponseSchema.parse(await response.json()).data.map((model) => model.id);
}
