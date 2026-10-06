import { parseRuntimeMessage } from "@glotterfly/protocol";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((rawMessage, _sender, sendResponse) => {
    const message = parseRuntimeMessage(rawMessage);

    if (message.type === "glotterfly.ping") {
      sendResponse({ ok: true, version: browser.runtime.getManifest().version });
    }
  });
});
