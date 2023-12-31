import type { KeyInputLike } from "../key-input.js";
import { CodeHistory } from "../code-history.js";
import { KeyInput } from "../key-input.js";

interface KeyboardEventLike extends KeyInputLike {
  type: string;
}

interface Matcher {
  /**
   * Match the current history of key codes with the matcher target history.
   *
   * e.g. `Ctrl + Shift + KeyA` as a target input matches
   * the current input such as:
   * - `Ctrl + Shift + KeyA`
   * - `Ctrl + Shift + Alt + KeyA`
   * - `Ctrl + Shift + KeyA + KeyB`
   * - `Ctrl + Shift + KeyB + KeyA`
   *
   * This method treats inputs as 2 parts:
   *
   * ```
   * Ctrl + Shift + KeyA + KeyB + KeyC + KeyD
   * |- Modifier -|--------- History --------|
   * ```
   *
   * "History" is the history of input codes which should be a superset of
   * the target history.
   *
   * "Modifier" is the modifier keys which is ignored if `options.rawMod`
   * is `true`, otherwise it should be also superset of the target history.
   *
   * @param options How to compare
   * @returns `true` if the latest history is a superset of the target history,
   * otherwise `false`.
   */
  match(o?: Option): boolean;
}

interface Option {
  rawMod?: boolean;
}

export class KeyHoldMatcher {
  private readonly currentHistory = new CodeHistory();

  constructor(private readonly targetInput: KeyInput) {}

  static parse(pattern: string) {
    return new KeyHoldMatcher(KeyInput.parse(pattern));
  }

  keydown(event: KeyboardEventLike): Matcher {
    if (event.type !== "keydown") {
      console.warn("Unexpected event type: %s", event.type);
    }
    this.currentHistory.put(event.code);
    return this.buildMatcher(event);
  }

  keyup(event: KeyboardEventLike): Matcher {
    if (event.type !== "keyup") {
      console.warn("Unexpected event type: %s", event.type);
    }
    this.currentHistory.remove(event.code);
    return this.buildMatcher(event);
  }

  private buildMatcher(event: KeyboardEventLike): Matcher {
    const key = new KeyInput(event, this.currentHistory.copy());
    return {
      match: ({ rawMod = false }: Option = {}) =>
        this.targetInput.isSubsetOf(key, rawMod),
    };
  }

  reset() {
    this.currentHistory.clear();
  }
}
