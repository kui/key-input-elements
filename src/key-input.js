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

interface EventMatcherOptions {
  allowModOnly?: boolean;
  noMod?: boolean;
  ignore?: ?RegExp;
}

const DEFAULT_OPTIONS = {
  allowModOnly: false,
  noMod: false,
  ignore: undefined,
};

class EventMatcher {
  pattern: string;
  options: EventMatcherOptions;

  constructor(pattern: string, options?: EventMatcherOptions = DEFAULT_OPTIONS) {
    this.pattern = pattern;
    this.options = options;
  }

  test(event: Event) {
    if (!(event instanceof KeyboardEvent)) return false;
    if (this.pattern.length === 0) return false;
    const value = buildValue((event: KeyboardEvent), this.options);
    return this.pattern === value;
  }
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

const MOD_KEYS = new Set(["Shift", "Alt", "Control", "Meta"]);

function buildValue(event: KeyboardEvent, options: EventMatcherOptions): ?string {
  const code = event.code;
  if (!options.allowModOnly && isModKey(event.key)) {
    return null;
  }

  let value;
  if (options.noMod) {
    value = code;
  } else {
    const a = [code];
    if (event.shiftKey && !code.startsWith("Shift"))   a.unshift("Shift");
    if (event.altKey   && !code.startsWith("Alt"))     a.unshift("Alt");
    if (event.ctrlKey  && !code.startsWith("Control")) a.unshift("Control");
    if (event.metaKey  && !code.startsWith("Meta"))    a.unshift("Meta");
    value = a.join(" + ");
  }

  const ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(key: string): boolean {
  return MOD_KEYS.has(key);
}

function markAttr(self: HTMLElement, name: string, b: boolean): void {
  if (b) {
    self.setAttribute(name, "");
  } else {
    self.removeAttribute(name);
  }
}
