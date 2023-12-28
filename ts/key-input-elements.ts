import { EventMatcher } from "./event-matcher.js";
import { KeyInput, isModKey } from "./key-input.js";

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
      this.type = "text";
      this.addEventListener(
        "keypress",
        (ev) => {
          ev.preventDefault();
        },
        true,
      );
      this.addEventListener("keydown", (e) => {
        if (this.readOnly) return;
        const keyEventString = buildKeyEventString(e, this);
        if (keyEventString != null) {
          this.value = keyEventString;
          e.preventDefault();
        }
      });
      this.addEventListener("focus", () => {
        this.select();
      });
    }

    static get observedAttributes() {
      return ["type"];
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      super.attributeChangedCallback?.(name, oldValue, newValue);
      switch (name) {
        case "type":
          this.type = "text";
          break;
      }
    }

    buildMatcher() {
      return EventMatcher.parse(this.value);
    }
  };
}

function buildKeyEventString(
  keyboardEvent: KeyboardEvent,
  options: KeyInputMixin,
) {
  const code = keyboardEvent.code;
  if (!options.allowModOnly && isModKey(keyboardEvent)) return null;

  let keyInput: KeyInput;
  if (options.stripMod) {
    keyInput = new KeyInput({ code });
  } else {
    keyInput = new KeyInput(keyboardEvent);
  }

  const keyEventString = keyInput.toString();
  if (options.ignore !== null && options.ignoreRegExp?.test(keyEventString)) {
    return null;
  }
  return keyEventString;
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
