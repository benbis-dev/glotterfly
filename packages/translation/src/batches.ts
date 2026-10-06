import type { Segment } from "@glotterfly/dom";

export interface BatchOptions {
  maxCharacters?: number;
  maxSegments?: number;
}

export function batchSegments(
  segments: readonly Segment[],
  options: BatchOptions = {},
): Segment[][] {
  const maxCharacters = options.maxCharacters ?? 12_000;
  const maxSegments = options.maxSegments ?? 60;
  const batches: Segment[][] = [];
  let batch: Segment[] = [];
  let characters = 0;

  for (const segment of segments) {
    const nextCharacters = characters + segment.text.length;
    if (batch.length > 0 && (batch.length >= maxSegments || nextCharacters > maxCharacters)) {
      batches.push(batch);
      batch = [];
      characters = 0;
    }
    batch.push(segment);
    characters += segment.text.length;
  }

  if (batch.length > 0) batches.push(batch);
  return batches;
}
