export class Controllerton {
  value: AbortController;
  constructor() {
    this.value = new AbortController();
  }
  reset() {
    this.abort();
    const controller = new AbortController();
    this.value = controller;
    return controller;
  }
  abort() {
    if (!this.signal.aborted) this.value.abort();
  }
  get signal() {
    return this.value.signal;
  }
  get aborted() {
    return this.value.signal.aborted;
  }
}
