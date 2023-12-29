import { CodeHistory } from "./code-history.js";
import { EqualsOptions, KeyInput, KeyInputLike } from "./key-input.js";

interface KeyboardEventLike extends KeyInputLike {
  type: string;
}

export class EventMatcher {
  readonly currentHistory = new CodeHistory();

  constructor(private readonly targetInput: KeyInput) {}

  static parse(pattern: string) {
    return new EventMatcher(KeyInput.parse(pattern));
  }

  keydown(event: KeyboardEventLike): {
    match(options?: EqualsOptions): boolean;
  } {
    if (event.type !== "keydown") {
      console.warn("Unexpected event type: %s", event.type);
    }
    const match = this.buildMatcher(event);
    this.currentHistory.put(event.code);
    return { match };
  }

  keyup(event: KeyboardEventLike): { match(options?: EqualsOptions): boolean } {
    if (event.type !== "keyup") {
      console.warn("Unexpected event type: %s", event.type);
    }
    const match = this.buildMatcher(event);
    this.currentHistory.remove(event.code);
    return { match };
  }

  buildMatcher(event: KeyboardEventLike) {
    const key = new KeyInput(event, this.currentHistory.copy());
    return (o: EqualsOptions = {}) => this.targetInput.equals(key, o);
  }
}
