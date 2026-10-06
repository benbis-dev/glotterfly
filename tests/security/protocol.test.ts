import { describe, expect, it } from "vitest";
import { parseRuntimeMessage } from "../../packages/protocol/src/messages";

describe("runtime protocol trust boundary", () => {
  it("rejects caller-supplied fetch URLs", () => {
    expect(() =>
      parseRuntimeMessage({
        type: "translation.start",
        targetLanguage: "fi-FI",
        mode: "bilingual",
        url: "https://attacker.invalid/proxy",
      }),
    ).toThrow();
  });
});
