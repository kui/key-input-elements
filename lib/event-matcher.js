"use strict";

exports.__esModule = true;
exports.buildValue = buildValue;


var MOD_KEYS = new Set(["Shift", "Alt", "Control", "Meta"]);


var DEFAULT_OPTIONS = {
  allowModOnly: false,
  noMod: false,
  ignore: undefined
};
exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
class EventMatcher {

  constructor(pattern) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;

    this.pattern = pattern;
    this.options = options;
  }

  test(event) {
    if (!(event instanceof KeyboardEvent)) return false;
    if (this.pattern.length === 0) return false;
    var value = buildValue(event, this.options);
    return this.pattern === value;
  }

  testModInsensitive(event) {
    if (!(event instanceof KeyboardEvent)) return false;
    if (this.pattern.length === 0) return false;
    var opts = Object.assign({ noMod: true }, this.options);
    var value = buildValue(event, opts);
    return this.pattern === value;
  }
}

exports.default = EventMatcher;
function buildValue(event, options) {
  var code = event.code;
  if (!options.allowModOnly && isModKey(event.key)) {
    return null;
  }

  var value = void 0;
  if (options.noMod) {
    value = code;
  } else {
    var a = [code];
    if (event.shiftKey && !code.startsWith("Shift")) a.unshift("Shift");
    if (event.altKey && !code.startsWith("Alt")) a.unshift("Alt");
    if (event.ctrlKey && !code.startsWith("Control")) a.unshift("Control");
    if (event.metaKey && !code.startsWith("Meta")) a.unshift("Meta");
    value = a.join(" + ");
  }

  var ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(key) {
  return MOD_KEYS.has(key);
}