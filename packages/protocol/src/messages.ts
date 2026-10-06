import { z } from "zod";

const pingSchema = z.object({ type: z.literal("glotterfly.ping") }).strict();
const startTranslationSchema = z
  .object({
    type: z.literal("translation.start"),
    targetLanguage: z.string().min(2).max(32),
    mode: z.enum(["bilingual", "translation-only"]),
  })
  .strict();
const stopTranslationSchema = z.object({ type: z.literal("translation.stop") }).strict();
const restoreSchema = z.object({ type: z.literal("translation.restore") }).strict();

export const runtimeMessageSchema = z.discriminatedUnion("type", [
  pingSchema,
  startTranslationSchema,
  stopTranslationSchema,
  restoreSchema,
]);

export type RuntimeMessage = z.infer<typeof runtimeMessageSchema>;

export function parseRuntimeMessage(input: unknown): RuntimeMessage {
  return runtimeMessageSchema.parse(input);
}
