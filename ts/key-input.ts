import EventMatcher, { buildValue } from "./event-matcher.js";

type HTMLInputElemenetConstructor<
  E extends HTMLInputElement = HTMLInputElement,
> = new () => E;

interface KeyInputMixin extends HTMLInputElement {
  allowModOnly: boolean;
  noMod: boolean;
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

    get noMod() {
      return this.hasAttribute("no-mod");
    }
    set noMod(b) {
      setBoolAtter(this, "no-mod", b);
    }

    get ignore() {
      const v = this.getAttribute("ignore");
      return v == null ? null : new RegExp(v);
    }
    set ignore(pattern) {
      if (pattern != null) this.setAttribute("ignore", pattern.toString());
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

export function mixinKeydownInput(base: HTMLInputElemenetConstructor) {
  return class extends mixinKeyInput(base) {
    constructor() {
      super();
      this.addEventListener("keydown", (e) => {
        handleEvent(this, e);
      });
    }
  };
}

export class KeydownInputElement extends mixinKeydownInput(HTMLInputElement) {}

export function mixinKeyupInput(c: HTMLInputElemenetConstructor) {
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
      this.addEventListener("keyup", (e) => {
        handleEvent(this, e);
      });
      this.addEventListener("keydown", (e) => {
        const ignore = this.ignore;
        if (!ignore) {
          e.preventDefault();
          return;
        }

        const v = buildValue(e, this);
        if (v && ignore.test(v)) {
          return;
        }

        e.preventDefault();
      });
    }
  };
}

export class KeyupInputElement extends mixinKeyupInput(HTMLInputElement) {}

export function register() {
  customElements.define("keydown-input", KeydownInputElement, {
    extends: "input",
  });
  customElements.define("keyup-input", KeyupInputElement, { extends: "input" });
}

//

function handleEvent(self: KeyInputMixin, event: KeyboardEvent) {
  if (self.readOnly) return;
  const v = buildValue(event, self);
  console.debug(event);
  if (v != null) self.value = v;
  if (v) event.preventDefault();
}

function setBoolAtter(self: Element, name: string, b: boolean) {
  if (b) {
    self.setAttribute(name, "");
  } else {
    self.removeAttribute(name);
  }
}
