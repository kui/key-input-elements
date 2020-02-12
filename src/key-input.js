import EventMatcher, { buildValue, DEFAULT_OPTIONS } from "./event-matcher";

function mixinKeyInput(c) {
  return class extends c {
    get allowModOnly() {
      return this.hasAttribute("allow-mod-only");
    }
    set allowModOnly(b) {
      markAttr(this, "allow-mod-only", b);
    }

    get noMod() {
      return this.hasAttribute("no-mod");
    }
    set noMod(b) {
      markAttr(this, "no-mod", b);
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
      this.addEventListener("keypress", ev => ev.preventDefault(), true);
      this.addEventListener("focus", () => this.select());
    }

    attachedCallback() {}

    static get observedAttributes() {
      return ["type"];
    }
    attributeChangedCallback(attrName) {
      switch (attrName) {
        case "type":
          this.type = "text";
          break;
      }
    }

    buildMatcher() {
      return new EventMatcher(this.value, generateOptions(this));
    }
  };
}

export function mixinKeydownInput(c) {
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
      this.addEventListener("keydown", e => handleEvent(this, e));
    }
  };
}

export class KeydownInputElement extends mixinKeydownInput(HTMLInputElement) {}

export function mixinKeyupInput(c) {
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
      this.addEventListener("keyup", e => handleEvent(this, e));
      this.addEventListener("keydown", e => {
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
    extends: "input"
  });
  customElements.define("keyup-input", KeyupInputElement, { extends: "input" });
}

//

function generateOptions(self) {
  const o = {};
  for (const [name, defaultValue] of Object.entries(DEFAULT_OPTIONS)) {
    const value = self[name];
    o[name] = value == null ? defaultValue : value;
  }
  return o;
}

function handleEvent(self, event) {
  if (self.readOnly) return;
  const v = buildValue(event, self);
  console.debug(event);
  if (v != null) self.value = v;
  if (v) event.preventDefault();
}

function markAttr(self, name, b) {
  if (b) {
    self.setAttribute(name, b);
  } else {
    self.removeAttribute(name);
  }
}
