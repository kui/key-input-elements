import { CodeHistory } from "./code-history.js";
import { KeyInput } from "./key-input.js";
import { isModKeyCode } from "./key-codes.js";

type HTMLInputElemenetConstructor<
  E extends HTMLInputElement = HTMLInputElement,
> = new () => E;

interface KeyInputMixin extends HTMLInputElement {
  rawMod: boolean;
  ignore: string | null;
  get ignoreRegExp(): RegExp | null;
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
        this.history.put(e.code);
        const keyEventString = this.buildKeyEventString(e);
        if (keyEventString !== null) {
          if (!this.ignoreRegExp?.test(keyEventString)) {
            this.value = keyEventString;
            this.dispatchEvent(new Event("change", { bubbles: true }));
          }
          e.preventDefault();
        }
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

    private buildKeyEventString(keyboardEvent: KeyboardEvent) {
      if (!this.rawMod && isModKeyCode(keyboardEvent.code)) return null;

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
