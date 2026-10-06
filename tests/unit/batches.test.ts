import { describe, expect, it } from "vitest";
import { batchSegments } from "../../packages/translation/src/batches";
import type { Segment } from "../../packages/dom/src/segment";

function segment(id: string, text: string, order: number): Segment {
  return { id, text, blockId: `block-${id}`, order };
}

describe("translation batching", () => {
  it("preserves order while respecting segment count", () => {
    const input = [segment("a", "one", 0), segment("b", "two", 1), segment("c", "three", 2)];
    const batches = batchSegments(input, { maxSegments: 2, maxCharacters: 100 });
    expect(batches.map((batch) => batch.map((item) => item.id))).toEqual([["a", "b"], ["c"]]);
  });
});
