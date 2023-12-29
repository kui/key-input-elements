import { EventMatcher } from "./event-matcher.js";
import { KeyInput, isModifierKey } from "./key-input.js";

type HTMLInputElemenetConstructor<
  E extends HTMLInputElement = HTMLInputElement,
> = new () => E;

interface KeyInputMixin extends HTMLInputElement {
  allowModOnly: boolean;
  stripMod: boolean;
  ignore: string | null;
  ignoreRegExp: RegExp | null;
  buildMatcher(): EventMatcher;
}

export function mixinKeyInput(
  base: HTMLInputElemenetConstructor,
): HTMLInputElemenetConstructor<KeyInputMixin> {
  return class extends base {
    private readonly historyCodes: string[] = [];

    get allowModOnly() {
      return this.hasAttribute("allow-mod-only");
    }
    set allowModOnly(b) {
      setBoolAtter(this, "allow-mod-only", b);
    }

    get stripMod() {
      return this.hasAttribute("strip-mod");
    }
    set stripMod(b) {
      setBoolAtter(this, "strip-mod", b);
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
          this.value = keyEventString;
          e.preventDefault();
        }
        arrayPushIfNotExists(this.historyCodes, e.code);
      });
      this.addEventListener("keyup", (e) => {
        arrayRemove(this.historyCodes, e.code);
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
      const code = keyboardEvent.code;
      if (!this.allowModOnly && isModifierKey(keyboardEvent.code)) return null;

      const event = this.stripMod ? { code } : keyboardEvent;
      const historyCodes: string[] = this.multiple ? this.historyCodes : [];
      const keyInput = new KeyInput(
        event,
        historyCodes.filter((c) => c !== code),
      );

      const keyEventString = keyInput.toString();
      if (this.ignoreRegExp?.test(keyEventString)) {
        return null;
      }
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

function arrayPushIfNotExists<T>(array: T[], value: T): boolean {
  if (array.includes(value)) return false;
  array.push(value);
  return true;
}

function arrayRemove<T>(array: T[], value: T): boolean {
  const index = array.indexOf(value);
  if (index < 0) return false;
  array.splice(index, 1);
  return true;
}
