export class RefreshCoordinator<T> {
  private inFlight: Promise<T> | undefined;

  run(refresh: () => Promise<T>): Promise<T> {
    if (this.inFlight) return this.inFlight;
    const operation = refresh().finally(() => {
      if (this.inFlight === operation) this.inFlight = undefined;
    });
    this.inFlight = operation;
    return operation;
  }
}
