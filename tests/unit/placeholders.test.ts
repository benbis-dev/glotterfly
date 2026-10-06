import { describe, expect, it } from "vitest";
import { protectPlaceholders, restorePlaceholders } from "../../packages/dom/src/placeholders";

describe("placeholder protection", () => {
  it("round-trips protected values", () => {
    const protectedText = protectPlaceholders(
      "See https://example.com and email hello@example.com with ${value} and {0}.",
      "test",
    );
    const translated = `Käännetty: ${protectedText.text}`;
    const restored = restorePlaceholders(translated, protectedText.placeholders);
    expect(restored).toContain("https://example.com");
    expect(restored).toContain("hello@example.com");
    expect(restored).toContain("${value}");
    expect(restored).toContain("{0}");
  });

  it("rejects a missing placeholder", () => {
    const protectedText = protectPlaceholders("Visit https://example.com", "test");
    expect(() => restorePlaceholders("Käännetty", protectedText.placeholders)).toThrow(
      "was not preserved exactly once",
    );
  });
});
