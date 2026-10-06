export class WorkQueue {
  private readonly pending: (() => void)[] = [];
  private active = 0;

  constructor(private readonly concurrency = 2) {
    if (!Number.isInteger(concurrency) || concurrency < 1)
      throw new Error("Concurrency must be positive");
  }

  run<T>(work: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const start = (): void => {
        if (signal?.aborted) {
          const reason =
            signal.reason instanceof Error
              ? signal.reason
              : new Error("Work queue aborted", { cause: signal.reason });
          reject(reason);
          this.drain();
          return;
        }
        this.active += 1;
        void work()
          .then(resolve, reject)
          .finally(() => {
            this.active -= 1;
            this.drain();
          });
      };
      this.pending.push(start);
      this.drain();
    });
  }

  private drain(): void {
    while (this.active < this.concurrency) {
      const next = this.pending.shift();
      if (!next) return;
      next();
    }
  }
}
