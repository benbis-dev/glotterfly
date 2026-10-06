import { z } from "zod";
import { errorFromResponse } from "./errors";
import type { OpenAIClientOptions } from "./models";
import { parseSseStream } from "./sse";

const eventSchema = z.looseObject({ type: z.string().min(1) });

export interface ResponseInputMessage {
  role: "user" | "developer";
  content: string;
}

export interface StreamResponseInput {
  model: string;
  instructions?: string;
  input: readonly ResponseInputMessage[];
}

export interface CompletedResponse {
  text: string;
  completedEvent: Record<string, unknown>;
}

export async function streamResponse(
  options: OpenAIClientOptions,
  request: StreamResponseInput,
  signal?: AbortSignal,
): Promise<CompletedResponse> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiBaseUrl = options.apiBaseUrl ?? "https://api.openai.com/v1";
  const response = await fetchImpl(`${apiBaseUrl}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      ...(request.instructions ? { instructions: request.instructions } : {}),
      input: request.input,
      store: false,
      stream: true,
    }),
    ...(signal !== undefined ? { signal } : {}),
  });
  if (!response.ok) throw await errorFromResponse(response);
  if (!response.body) throw new Error("OpenAI response stream is missing a body");

  let text = "";
  let completedEvent: Record<string, unknown> | undefined;
  for await (const message of parseSseStream(response.body)) {
    if (message.data === "[DONE]") continue;
    const event = eventSchema.parse(JSON.parse(message.data) as unknown);
    if (event.type === "response.output_text.delta" && typeof event["delta"] === "string") {
      text += event["delta"];
    }
    if (event.type === "response.completed") {
      completedEvent = event;
    }
    if (event.type === "error") {
      const messageValue =
        typeof event["message"] === "string" ? event["message"] : "OpenAI stream returned an error";
      throw new Error(messageValue);
    }
  }

  if (!completedEvent) throw new Error("OpenAI stream ended without response.completed");
  return { text, completedEvent };
}
