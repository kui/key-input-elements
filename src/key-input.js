declare interface KeyInput extends HTMLInputElement {}
export interface KeyupInput extends KeyupInput {}
export interface KeydownInput extends KeyupInput {}

function mixinKeyInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeyInput> {
  // $FlowFixMe Force cast to returned type
  return class extends c {
    constructor() {
      super();
    }

    createdCallback() {
      console.log("created", this);
    }

    attachedCallback() {
      console.log("attached", this);
    }

    static get observedAttributes() {
      return [
        "type",
      ];
    }

    attributeChangedCallback(attrName: string) {
      switch (attrName) {
      case "type":
        this.type = "text";
        break;
      }
    }
  };
}

export function mixinKeyupInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeyupInput> {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }
  };
}

export function mixinKeydownInput<T: HTMLInputElement>(c: Class<T>): Class<T & KeydownInput> {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }
  };
}

export class HTMLKeyupInputElement extends mixinKeyupInput(HTMLInputElement) {
  static get extends() { return "input"; }
}
export class HTMLKeydownInputElement extends mixinKeydownInput(HTMLInputElement) {
  static get extends() { return "input"; }
}

export default {
  register() {
    document.registerElement("keyup-input", HTMLKeyupInputElement);
    document.registerElement("keydown-input", HTMLKeydownInputElement);
  }
};
