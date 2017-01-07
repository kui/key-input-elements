"use strict";

exports.__esModule = true;
exports.buildValue = buildValue;


var META_CODES = new Set(["Meta", "MetaLeft", "MetaRight"]);

var CTRL_CODES = new Set(["Control", "ControlLeft", "ControlRight"]);
var ALT_CODES = new Set(["Alt", "AltLeft", "AltRight"]);
var SHIFT_CODES = new Set(["Shift", "ShiftLeft", "ShiftRight"]);

var MOD_CODES = new Set([...Array.from(META_CODES.values()), ...Array.from(CTRL_CODES.values()), ...Array.from(ALT_CODES.values()), ...Array.from(SHIFT_CODES.values())]);

var DEFAULT_OPTIONS = {
  allowModOnly: false,
  noMod: false,
  ignore: undefined
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
class EventMatcher {

  constructor(pattern) {
    this.key = parseValue(pattern);
  }

  test(k) {
    return k.shiftKey === this.key.shiftKey && k.altKey === this.key.altKey && k.ctrlKey === this.key.ctrlKey && k.metaKey === this.key.metaKey && this.testModInsensitive(k);
  }

  testModInsensitive(k) {
    return this.key.code === k.code;
  }
}

exports.default = EventMatcher;
function parseValue(pattern) {
  var splitted = pattern.split(" + ");
  var key = { altKey: false, shiftKey: false, ctrlKey: false, metaKey: false, code: "" };
  while (splitted.length !== 1) {
    var m = splitted.shift();
    switch (m) {
      case "Meta":
        key.metaKey = true;break;
      case "Ctrl":
        key.ctrlKey = true;break;
      case "Alt":
        key.altKey = true;break;
      case "Shift":
        key.shiftKey = true;break;
      default:
        throw Error(`Unexpected mod: ${ m }`);
    }
  }
  key.code = splitted[0];
  return key;
}

function buildValue(key, options) {
  var code = key.code;
  if (!options.allowModOnly && isModKey(key.code)) {
    return null;
  }

  var value = void 0;
  if (options.noMod) {
    value = code;
  } else {
    var a = [code];
    if (key.metaKey && !isMetaKey(code)) a.unshift("Meta");
    if (key.ctrlKey && !isCtrlKey(code)) a.unshift("Ctrl");
    if (key.altKey && !isAltKey(code)) a.unshift("Alt");
    if (key.shiftKey && !isShiftKey(code)) a.unshift("Shift");
    value = a.join(" + ");
  }

  var ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(code) {
  return MOD_CODES.has(code);
}
function isMetaKey(code) {
  return META_CODES.has(code);
}
function isCtrlKey(code) {
  return CTRL_CODES.has(code);
}
function isAltKey(code) {
  return ALT_CODES.has(code);
}
function isShiftKey(code) {
  return SHIFT_CODES.has(code);
}