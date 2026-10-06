import { chromium, expect, test } from "@playwright/test";
import { join } from "node:path";

const extensionPath = join(process.cwd(), "apps/extension/.output/chrome-mv3");

test("loads the packaged extension popup", async () => {
  const context = await chromium.launchPersistentContext("", {
    channel: "chromium",
    headless: true,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });
  try {
    let [serviceWorker] = context.serviceWorkers();
    serviceWorker ??= await context.waitForEvent("serviceworker");
    const extensionId = new URL(serviceWorker.url()).host;
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await expect(page.getByRole("heading", { name: "Glotterfly" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue with ChatGPT" })).toBeDisabled();
  } finally {
    await context.close();
  }
});
