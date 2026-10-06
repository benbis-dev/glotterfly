import { describe, expect, it, vi } from "vitest";
import { RefreshCoordinator } from "../../packages/auth-siwc/src/refresh";

describe("refresh serialization", () => {
  it("coalesces concurrent refresh requests", async () => {
    const coordinator = new RefreshCoordinator<string>();
    let release: ((value: string) => void) | undefined;
    const refresh = vi.fn(
      () =>
        new Promise<string>((resolve) => {
          release = resolve;
        }),
    );

    const first = coordinator.run(refresh);
    const second = coordinator.run(refresh);
    expect(refresh).toHaveBeenCalledTimes(1);
    release?.("new-token");
    await expect(Promise.all([first, second])).resolves.toEqual(["new-token", "new-token"]);
  });
});
