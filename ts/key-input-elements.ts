import { CodeHistory } from "./code-history.js";
import { EventMatcher } from "./event-matcher.js";
import { KeyInput, isModifierKey } from "./key-input.js";

type HTMLInputElemenetConstructor<
  E extends HTMLInputElement = HTMLInputElement,
> = new () => E;

interface KeyInputMixin extends HTMLInputElement {
  rawMod: boolean;
  ignore: string | null;
  get ignoreRegExp(): RegExp | null;
  buildMatcher(): EventMatcher;
}

export function mixinKeyInput(
  base: HTMLInputElemenetConstructor,
): HTMLInputElemenetConstructor<KeyInputMixin> {
  return class extends base {
    private readonly history = new CodeHistory();

    /**
     * If true, modifier keys are treated as normal keys.
     */
    get rawMod() {
      return this.hasAttribute("raw-mod");
    }
    set rawMod(b) {
      setBoolAtter(this, "raw-mod", b);
    }

    get ignore() {
      return this.getAttribute("ignore");
    }
    set ignore(s) {
      if (s === null) {
        this.removeAttribute("ignore");
      } else {
        this.setAttribute("ignore", s);
      }
    }
    get ignoreRegExp() {
      const ignore = this.ignore;
      if (ignore == null) return null;
      return new RegExp(ignore);
    }

    get value() {
      return super.value;
    }
    set value(v) {
      super.value = v;
      if (document.activeElement === this) {
        this.select();
      }
    }

    constructor() {
      super();
      if (this.type !== "text") {
        console.warn("KeyInputElement: type must be text");
      }
      this.removeAttribute("type");
      this.addEventListener("keydown", (e) => {
        if (this.readOnly) return;
        const keyEventString = this.buildKeyEventString(e);
        if (keyEventString !== null) {
          if (!this.ignoreRegExp?.test(keyEventString)) {
            this.value = keyEventString;
          }
          e.preventDefault();
        }
        this.history.put(e.code);
      });
      this.addEventListener("keyup", (e) => {
        this.history.remove(e.code);
      });
      this.addEventListener("focus", () => {
        this.select();
      });
    }

    static get observedAttributes() {
      return ["type"];
    }
    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null,
    ) {
      super.attributeChangedCallback?.(name, oldValue, newValue);
      if (name === "type") {
        if (this.type !== "text") {
          console.warn("KeyInputElement: type must be text");
        }
        if (newValue !== null) {
          this.removeAttribute("type");
        }
      }
    }

    buildMatcher() {
      return EventMatcher.parse(this.value);
    }

    private buildKeyEventString(keyboardEvent: KeyboardEvent) {
      if (!this.rawMod && isModifierKey(keyboardEvent.code)) return null;

      const keyInput = new KeyInput(keyboardEvent, this.history);
      const keyEventString = keyInput.toString({
        rawMod: this.rawMod,
        stripHistory: !this.multiple,
      });
      return keyEventString;
    }
  };
}

export class KeyInputElement extends mixinKeyInput(HTMLInputElement) {
  static register() {
    customElements.define("key-input", this, { extends: "input" });
  }
}

//

function setBoolAtter(self: Element, name: string, b: boolean) {
  if (b) {
    self.setAttribute(name, "");
  } else {
    self.removeAttribute(name);
  }
}
