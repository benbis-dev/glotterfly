import { describe, expect, it } from "vitest";
import { validateTranslationResult } from "../../packages/translation/src/validation";
import type { Segment } from "../../packages/dom/src/segment";

const source: Segment[] = [
  { id: "b00000", blockId: "block-0", text: "Hello", order: 0 },
  { id: "b00001", blockId: "block-1", text: "World", order: 1 },
];

describe("translation result validation", () => {
  it("accepts exact segment ids", () => {
    expect(
      validateTranslationResult(
        {
          segments: [
            { id: "b00000", text: "Hei" },
            { id: "b00001", text: "Maailma" },
          ],
        },
        source,
      ).segments,
    ).toHaveLength(2);
  });

  it("rejects missing ids", () => {
    expect(() =>
      validateTranslationResult({ segments: [{ id: "b00000", text: "Hei" }] }, source),
    ).toThrow("Missing translation segment ID");
  });
});
