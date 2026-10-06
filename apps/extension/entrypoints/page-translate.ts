import { discoverReadableBlocks } from "@glotterfly/dom";

export default defineUnlistedScript(() => {
  const blocks = discoverReadableBlocks(document);
  document.documentElement.dataset.glotterflyDiscoveredBlocks = String(blocks.length);
});
