import { KeyInput } from "./key-input.js";

export class EventMatcher {
  constructor(private readonly keyInput: KeyInput) {}

  static parse(pattern: string) {
    return new EventMatcher(KeyInput.parse(pattern));
  }

  test(k: KeyboardEvent, historyCodes: string[] = []) {
    return (
      k.shiftKey === this.keyInput.shiftKey &&
      k.altKey === this.keyInput.altKey &&
      k.ctrlKey === this.keyInput.ctrlKey &&
      k.metaKey === this.keyInput.metaKey &&
      this.testModInsensitive(k, historyCodes)
    );
  }

  testModInsensitive(k: KeyboardEvent, historyCodes: string[] = []) {
    return (
      this.keyInput.code === k.code &&
      arrayIsEqualsOrderInsensitive(historyCodes, this.keyInput.historyCodes)
    );
  }
}

const arrayIsEqualsOrderInsensitive = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  if (a.length === 0) return true;
  if (a === b) return true;
  const a2 = a.toSorted();
  return b.toSorted().every((v, i) => v === a2[i]);
};
