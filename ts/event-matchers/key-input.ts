import type { KeyInputEqualsOptions, KeyInputLike } from "../key-input.js";
import { CodeHistory } from "../code-history.js";
import { KeyInput } from "../key-input.js";

interface KeyboardEventLike extends KeyInputLike {
  type: string;
}

interface Matcher {
  /**
   * Match the latest key code with the matcher target key code.
   *
   * e.g. `Ctrl+Shift+KeyA` as a target input matches `Ctrl+Shift+KeyA`.
   * If `options.historySensitive` is `"ignore"`,
   * it also matches `Ctrl+Shift+KeyB+KeyA` but not `Ctrl+Shift+KeyA+KeyB`.
   *
   * This method treats inputs as 3 parts:
   *
   * ```
   * Ctrl + Shift + KeyA + KeyB + KeyC +  KeyD
   * |- Modifier -|----- History ------|- Input -|
   * ```
   *
   * "Input" is the last input code which should be matched in this method.
   *
   * "History" is the history of input codes which should be matched depending
   * on `options.historySensitive`.
   *
   * "Modifier" is the modifier keys which is ignored if `options.rawMod`
   * is `true`.
   *
   * @param options How to compare
   * @see {@link KeyInputEqualsOptions}
   */
  match(options?: KeyInputEqualsOptions): boolean;
}

export class KeyInputMatcher {
  private readonly currentHistory = new CodeHistory();

  constructor(private readonly targetInput: KeyInput) {}

  static parse(pattern: string) {
    return new KeyInputMatcher(KeyInput.parse(pattern));
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
    const matcher = this.buildMatcher(event);
    this.currentHistory.remove(event.code);
    return matcher;
  }

  private buildMatcher(event: KeyboardEventLike): Matcher {
    const key = new KeyInput(event, this.currentHistory.copy());
    return {
      match: (o: KeyInputEqualsOptions = {}) => this.targetInput.equals(key, o),
    };
  }

  reset() {
    this.currentHistory.clear();
  }
}
