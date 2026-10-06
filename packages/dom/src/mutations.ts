import { OWNED_ATTR } from "./render";

export function observePageChanges(
  onCandidate: (element: Element) => void,
  debounceMs = 300,
): MutationObserver {
  const pending = new Set<Element>();
  let timer: number | undefined;

  const flush = (): void => {
    timer = undefined;
    for (const element of pending) onCandidate(element);
    pending.clear();
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.closest(`[${OWNED_ATTR}]`)) continue;
        pending.add(node);
      }
      if (record.type === "characterData" && record.target.parentElement) {
        pending.add(record.target.parentElement);
      }
    }
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(flush, debounceMs);
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  return observer;
}
