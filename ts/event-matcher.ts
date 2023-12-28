import { KeyInput } from "./key-input.js";

export class EventMatcher {
  constructor(private readonly keyInput: KeyInput) {}

  static parse(pattern: string) {
    return new EventMatcher(KeyInput.parse(pattern));
  }

  test(k: KeyboardEvent) {
    return (
      k.shiftKey === this.keyInput.shiftKey &&
      k.altKey === this.keyInput.altKey &&
      k.ctrlKey === this.keyInput.ctrlKey &&
      k.metaKey === this.keyInput.metaKey &&
      this.testModInsensitive(k)
    );
  }

  testModInsensitive(k: KeyboardEvent) {
    return this.keyInput.code === k.code;
  }
}
