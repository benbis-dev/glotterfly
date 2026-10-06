export const OWNED_ATTR = "data-glotterfly-owned";
const ORIGINAL_HIDDEN_ATTR = "data-glotterfly-original-was-hidden";

export type TranslationMode = "bilingual" | "translation-only";

export function renderTranslation(
  source: HTMLElement,
  translatedText: string,
  mode: TranslationMode,
): HTMLElement {
  const translated = document.createElement("div");
  translated.setAttribute(OWNED_ATTR, "translation");
  translated.dataset["translationFor"] = source.dataset["glotterflyBlockId"] ?? "";
  translated.textContent = translatedText;
  source.insertAdjacentElement("afterend", translated);

  if (mode === "translation-only") {
    source.setAttribute(ORIGINAL_HIDDEN_ATTR, String(source.hidden));
    source.hidden = true;
  }
  return translated;
}

export function restoreOriginals(root: ParentNode = document): void {
  for (const translated of root.querySelectorAll(`[${OWNED_ATTR}]`)) translated.remove();
  for (const source of root.querySelectorAll<HTMLElement>(`[${ORIGINAL_HIDDEN_ATTR}]`)) {
    source.hidden = source.getAttribute(ORIGINAL_HIDDEN_ATTR) === "true";
    source.removeAttribute(ORIGINAL_HIDDEN_ATTR);
  }
}
