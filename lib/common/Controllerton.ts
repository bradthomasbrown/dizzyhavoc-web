export class Controllerton {
  value: AbortController;
  constructor() {
    this.value = new AbortController();
  }
  reset() {
    this.value.abort();
    const controller = new AbortController();
    this.value = controller;
    return this;
  }
  abort() {
    this.value.abort();
  }
  get signal() {
    return this.value.signal;
  }
  get aborted() {
    return this.value.signal.aborted;
  }
}
