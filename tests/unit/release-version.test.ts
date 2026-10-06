import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

async function readPackageVersion(path: string): Promise<string> {
  const contents = await readFile(path, "utf8");
  const parsed = JSON.parse(contents) as { version?: unknown };

  if (typeof parsed.version !== "string") {
    throw new Error(`${path} does not contain a string version`);
  }

  return parsed.version;
}

describe("release version surfaces", () => {
  it("keeps the product and browser extension versions synchronized", async () => {
    const rootVersion = await readPackageVersion("package.json");
    const extensionVersion = await readPackageVersion("apps/extension/package.json");

    expect(extensionVersion).toBe(rootVersion);
  });
});
