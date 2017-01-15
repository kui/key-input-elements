"use strict";

exports.__esModule = true;
exports.KeyupInputElement = exports.KeydownInputElement = undefined;
exports.mixinKeydownInput = mixinKeydownInput;
exports.mixinKeyupInput = mixinKeyupInput;
exports.register = register;

var _eventMatcher = require("./event-matcher");

var _eventMatcher2 = _interopRequireDefault(_eventMatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mixinKeyInput(c) {
  // $FlowFixMe Force cast to returned type
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
      var v = this.getAttribute("ignore");
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
    }

    createdCallback() {
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
      return new _eventMatcher2.default(this.value, generateOptions(this));
    }
  };
}
function mixinKeydownInput(c) {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }

    createdCallback() {
      super.createdCallback();
      this.addEventListener("keydown", e => handleEvent(this, e));
    }
  };
}

class KeydownInputElement extends mixinKeydownInput(HTMLInputElement) {
  static get extends() {
    return "input";
  }
}

exports.KeydownInputElement = KeydownInputElement;
function mixinKeyupInput(c) {
  // $FlowFixMe Force cast to returned type
  return class extends mixinKeyInput(c) {
    constructor() {
      super();
    }

    createdCallback() {
      super.createdCallback();
      this.addEventListener("keyup", e => handleEvent(this, e));
      this.addEventListener("keydown", e => {
        var ignore = this.ignore;
        if (!ignore) {
          e.preventDefault();
          return;
        }

        var v = (0, _eventMatcher.buildValue)(e, this);
        if (v && ignore.test(v)) {
          return;
        }

        e.preventDefault();
      });
    }
  };
}

class KeyupInputElement extends mixinKeyupInput(HTMLInputElement) {
  static get extends() {
    return "input";
  }
}

exports.KeyupInputElement = KeyupInputElement;
function register() {
  document.registerElement("keydown-input", KeydownInputElement);
  document.registerElement("keyup-input", KeyupInputElement);
}

//

function generateOptions(self) {
  var o = {};
  for (var _iterator = Object.entries(_eventMatcher.DEFAULT_OPTIONS), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref2 = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref2 = _i.value;
    }

    var _ref = _ref2;
    var name = _ref[0];
    var defaultValue = _ref[1];

    var value = self[name];
    o[name] = value == null ? defaultValue : value;
  }
  return o;
}

function handleEvent(self, event) {
  if (self.readOnly) return;
  var v = (0, _eventMatcher.buildValue)(event, self);
  console.log(event);
  if (v != null) self.value = v;
  if (v) event.preventDefault();
}

function markAttr(self, name, b) {
  if (b) {
    self.setAttribute(name, "");
  } else {
    self.removeAttribute(name);
  }
}