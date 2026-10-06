import type { Segment } from "@glotterfly/dom";
import { z } from "zod";
import type { TranslationResult } from "./provider";

const resultSchema = z
  .object({
    segments: z.array(z.object({ id: z.string().min(1), text: z.string() }).strict()),
  })
  .strict();

export function validateTranslationResult(
  input: unknown,
  source: readonly Segment[],
): TranslationResult {
  const result = resultSchema.parse(input);
  const expectedIds = new Set(source.map((segment) => segment.id));
  const seen = new Set<string>();

  for (const segment of result.segments) {
    if (!expectedIds.has(segment.id))
      throw new Error(`Unexpected translation segment ID: ${segment.id}`);
    if (seen.has(segment.id)) throw new Error(`Duplicate translation segment ID: ${segment.id}`);
    seen.add(segment.id);
  }
  for (const expectedId of expectedIds) {
    if (!seen.has(expectedId)) throw new Error(`Missing translation segment ID: ${expectedId}`);
  }
  return result;
}
