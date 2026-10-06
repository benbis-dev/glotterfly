const status = document.querySelector<HTMLParagraphElement>("#status");
const inspectButton = document.querySelector<HTMLButtonElement>("#inspect-page");
const languageSelect = document.querySelector<HTMLSelectElement>("#target-language");

async function loadSettings(): Promise<void> {
  const stored = await browser.storage.local.get("targetLanguage");
  const targetLanguage = stored.targetLanguage;
  if (typeof targetLanguage === "string" && languageSelect) {
    languageSelect.value = targetLanguage;
  }
}

languageSelect?.addEventListener("change", () => {
  void browser.storage.local.set({ targetLanguage: languageSelect.value });
});

inspectButton?.addEventListener("click", () => {
  void (async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id === undefined) {
      if (status) status.textContent = "No active tab is available.";
      return;
    }

    try {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["/page-translate.js"],
      });
      if (status)
        status.textContent = "Page access granted for this tab. Translation is not enabled yet.";
    } catch {
      if (status) status.textContent = "This page cannot be accessed by the extension.";
    }
  })();
});

void loadSettings();
