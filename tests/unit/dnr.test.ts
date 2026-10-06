import { describe, expect, it, vi } from "vitest";
import {
  callbackRegex,
  installLoopbackIntercept,
  type DnrApi,
} from "../../packages/auth-siwc/src/dnr";

describe("loopback DNR rule", () => {
  it("matches only the exact callback port and path", () => {
    const regex = new RegExp(callbackRegex(53147));
    expect(regex.test("http://127.0.0.1:53147/auth/callback?code=a&state=b")).toBe(true);
    expect(regex.test("http://127.0.0.1:53148/auth/callback?code=a&state=b")).toBe(false);
    expect(regex.test("http://127.0.0.1:53147/other?code=a")).toBe(false);
  });

  it("checks regex support before installing the session rule", async () => {
    const updateSessionRules = vi.fn<DnrApi["updateSessionRules"]>(() => Promise.resolve());
    await installLoopbackIntercept(
      {
        isRegexSupported: vi.fn(() => Promise.resolve({ isSupported: true })),
        updateSessionRules,
      },
      53147,
      "chrome-extension://example/oauth-callback.html",
    );
    expect(updateSessionRules).toHaveBeenCalledTimes(1);
    expect(updateSessionRules.mock.calls[0]?.[0].addRules?.[0]?.condition.regexFilter).toContain(
      "53147",
    );
  });
});
