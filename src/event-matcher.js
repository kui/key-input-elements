// @flow
export interface EventMatcherOptions {
  allowModOnly?: boolean;
  noMod?: boolean;
  ignore?: ?RegExp;
}

const META_CODES  = new Set(["Meta", "MetaLeft", "MetaRight"]);
const CTRL_CODES  = new Set(["Control", "ControlLeft", "ControlRight"]);
const ALT_CODES   = new Set(["Alt", "AltLeft", "AltRight"]);
const SHIFT_CODES = new Set(["Shift", "ShiftLeft", "ShiftRight"]);

const MOD_CODES = new Set([
  ...Array.from(META_CODES),
  ...Array.from(CTRL_CODES),
  ...Array.from(ALT_CODES),
  ...Array.from(SHIFT_CODES),
]);

const DEFAULT_OPTIONS = {
  allowModOnly: false,
  noMod: false,
  ignore: undefined,
};
export { DEFAULT_OPTIONS };

export interface Key {
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  code: string;
}

export default class EventMatcher {
  key: Key;

  constructor(pattern: string) {
    this.key = parseValue(pattern);
  }

  test(k: Key): boolean {
    return k.shiftKey === this.key.shiftKey
      && k.altKey  === this.key.altKey
      && k.ctrlKey === this.key.ctrlKey
      && k.metaKey === this.key.metaKey
      && this.testModInsensitive(k);
  }

  testModInsensitive(k: Key): boolean {
    return this.key.code === k.code;
  }
}

function parseValue(pattern: string): Key {
  const splitted = pattern.split(" + ");
  const key = { altKey: false, shiftKey: false, ctrlKey: false, metaKey: false, code: "" };
  while (splitted.length !== 1) {
    const m = splitted.shift();
    switch (m) {
    case "Meta":  key.metaKey  = true; break;
    case "Ctrl":  key.ctrlKey  = true; break;
    case "Alt":   key.altKey   = true; break;
    case "Shift": key.shiftKey = true; break;
    default: throw Error(`Unexpected mod: ${m}`);
    }
  }
  key.code = splitted[0];
  return key;
}

export function buildValue(key: Key, options: EventMatcherOptions): ?string {
  const code = key.code;
  if (!options.allowModOnly && isModKey(key.code)) {
    return null;
  }

  let value;
  if (options.noMod) {
    value = code;
  } else {
    const a = [code];
    if (key.metaKey  && !isMetaKey(code))  a.unshift("Meta");
    if (key.ctrlKey  && !isCtrlKey(code))  a.unshift("Ctrl");
    if (key.altKey   && !isAltKey(code))   a.unshift("Alt");
    if (key.shiftKey && !isShiftKey(code)) a.unshift("Shift");
    value = a.join(" + ");
  }

  const ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(code: string): boolean   { return MOD_CODES.has(code); }
function isMetaKey(code: string): boolean  { return META_CODES.has(code); }
function isCtrlKey(code: string): boolean  { return CTRL_CODES.has(code); }
function isAltKey(code: string): boolean   { return ALT_CODES.has(code); }
function isShiftKey(code: string): boolean { return SHIFT_CODES.has(code); }
