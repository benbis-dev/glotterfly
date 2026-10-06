export interface Segment {
  id: string;
  text: string;
  blockId: string;
  order: number;
}

export function normalizeSourceText(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

export function segmentElements(elements: readonly Element[]): Segment[] {
  return elements.flatMap((element, order) => {
    const text = normalizeSourceText(element.textContent ?? "");
    if (!text) return [];
    const blockId = `block-${order.toString().padStart(5, "0")}`;
    return [{ id: `b${order.toString().padStart(5, "0")}`, text, blockId, order }];
  });
}
