import { isReadableElement } from "./filter";

const BLOCK_SELECTOR = "p,li,h1,h2,h3,h4,h5,h6,blockquote,figcaption,td,th,dd,dt";

export function discoverReadableBlocks(root: Document | Element): Element[] {
  return [...root.querySelectorAll(BLOCK_SELECTOR)].filter((element) => {
    if (!isReadableElement(element)) return false;
    return (element.textContent ?? "").trim().length > 0;
  });
}
