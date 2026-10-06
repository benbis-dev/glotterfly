import { basename, dirname } from "node:path";
import { defineConfig } from "wxt";

const customOutputDir = process.env.GLOTTERFLY_OUT_DIR?.trim();

const outputConfig = customOutputDir
  ? {
      // Make the requested path the extension root itself rather than
      // producing <requested>/chrome-mv3/.
      outDir: dirname(customOutputDir),
      outDirTemplate: basename(customOutputDir),
    }
  : {};

export default defineConfig({
  ...outputConfig,
  manifestVersion: 3,
  manifest: {
    name: "Glotterfly",
    short_name: "Glotterfly",
    description: "Translate webpages directly with your eligible ChatGPT plan.",
    permissions: ["activeTab", "storage", "scripting", "declarativeNetRequest"],
    host_permissions: [
      "http://127.0.0.1/*",
      "https://auth.openai.com/*",
      "https://api.openai.com/*",
    ],
    incognito: "not_allowed",
    action: {
      default_title: "Glotterfly",
    },
    web_accessible_resources: [
      {
        resources: ["oauth-callback.html"],
        matches: ["http://127.0.0.1/*", "https://auth.openai.com/*"],
      },
    ],
  },
});
