// @flow
import EventMatcher, { buildValue, DEFAULT_OPTIONS } from "./event-matcher";
import type EventMatcherOptions from "./event-matcher";

declare interface KeyInput extends HTMLInputElement {
  allowModOnly: boolean;
  noMod: boolean;
  ignore: ?RegExp;
}
export interface KeyupInput extends KeyInput {}
export interface KeydownInput extends KeyInput {}

function mixinKeyInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeyInput> {
  // $FlowFixMe Force cast to returned type
  return class extends c {
    get allowModOnly(): boolean { return this.hasAttribute("allow-mod-only"); }
    set allowModOnly(b: boolean): void { markAttr(this, "allow-mod-only", b); }

    get noMod(): boolean { return this.hasAttribute("no-mod"); }
    set noMod(b: boolean): void { markAttr(this, "no-mod", b); }

    get ignore(): ?RegExp {
      const v = this.getAttribute("ignore");
      return v == null ? null : new RegExp(v);
    }
    set ignore(pattern: ?RegExp): void {
      if (pattern != null) this.setAttribute("ignore", pattern.toString());
    }

    get value(): string { return super.value; }
    set value(v: string): void {
      super.value = v;
      this.select();
    }

    constructor() {
      super();
    }

    createdCallback() {
      this.type = "text";
      this.addEventListener("keypress", (ev: KeyboardEvent) => ev.preventDefault(), true);
      this.addEventListener("focus", () => this.select());
    }

    attachedCallback() {}

    static get observedAttributes() { return ["type"]; }
    attributeChangedCallback(attrName: string) {
      switch (attrName) {
      case "type":
        this.type = "text";
        break;
      }
    }

    buildMatcher(): EventMatcher {
      return new EventMatcher(this.value, generateOptions(this));
    }
  };
}

export function mixinKeydownInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeydownInput> {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }

    createdCallback() {
      super.createdCallback();
      this.addEventListener("keydown", (e: KeyboardEvent) => handleEvent(this, e));
    }
  };
}

export class KeydownInputElement extends mixinKeydownInput(HTMLInputElement) {
  static get extends() { return "input"; }
}

export function mixinKeyupInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeyupInput> {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }

    createdCallback() {
      super.createdCallback();
      this.addEventListener("keyup", (e: KeyboardEvent) => handleEvent(this, e));
      this.addEventListener("keydown", (e: KeyboardEvent) => {
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

export class KeyupInputElement extends mixinKeyupInput(HTMLInputElement) {
  static get extends() { return "input"; }
}

export function register() {
  document.registerElement("keydown-input", KeydownInputElement);
  document.registerElement("keyup-input", KeyupInputElement);
}

//

function generateOptions(self: KeyInput): EventMatcherOptions {
  const o: any = {};
  for (const [name, defaultValue] of Object.entries(DEFAULT_OPTIONS)) {
    const value = (self: any)[name];
    o[name] = value == null ? defaultValue : value;
  }
  return o;
}

function handleEvent(self: KeyInput, event: KeyboardEvent) {
  if (self.readOnly) return;
  const v = buildValue(event, self);
  console.log(event);
  if (v != null) self.value = v;
  if (v) event.preventDefault();
}

function markAttr(self: HTMLElement, name: string, b: boolean): void {
  if (b) {
    self.setAttribute(name, "");
  } else {
    self.removeAttribute(name);
  }
}
