import { EventMatcher, buildKeyEventString } from "./event-matcher.js";

type HTMLInputElemenetConstructor<
  E extends HTMLInputElement = HTMLInputElement,
> = new () => E;

interface KeyInputMixin extends HTMLInputElement {
  allowModOnly: boolean;
  stripMod: boolean;
  ignore: RegExp | null;
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
      const v = this.getAttribute("ignore");
      return v === null ? null : new RegExp(v);
    }
    set ignore(pattern) {
      if (pattern === null) {
        this.removeAttribute("ignore");
      } else {
        this.setAttribute("ignore", pattern.toString());
      }
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
        const keyString = buildKeyEventString(e, this);
        if (keyString != null) {
          this.value = keyString;
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
