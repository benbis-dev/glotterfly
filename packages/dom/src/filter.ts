const EXCLUDED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "CANVAS",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "PRE",
  "CODE",
  "KBD",
  "SAMP",
]);

export function isReadableElement(element: Element): boolean {
  if (EXCLUDED_TAGS.has(element.tagName)) return false;
  if (element.hasAttribute("hidden") || element.getAttribute("aria-hidden") === "true")
    return false;
  if (element.closest("[data-glotterfly-owned]")) return false;
  if (element.closest("[contenteditable]:not([contenteditable='false'])")) return false;
  return true;
}
