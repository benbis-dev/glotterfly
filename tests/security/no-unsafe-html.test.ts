import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

async function sourceFiles(root: string): Promise<string[]> {
  const output: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) output.push(...(await sourceFiles(path)));
    else if ([".ts", ".tsx"].includes(extname(entry.name))) output.push(path);
  }
  return output;
}

describe("safe rendering invariant", () => {
  it("does not use innerHTML in runtime source", async () => {
    const files = [...(await sourceFiles("apps/extension")), ...(await sourceFiles("packages"))];
    for (const file of files) {
      const source = await readFile(file, "utf8");
      expect(source, file).not.toMatch(/\.innerHTML\s*=/u);
      expect(source, file).not.toMatch(/insertAdjacentHTML\s*\(/u);
    }
  });
});
