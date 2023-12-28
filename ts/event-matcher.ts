const META_CODES = new Set(["Meta", "MetaLeft", "MetaRight"]);

const CTRL_CODES = new Set(["Control", "ControlLeft", "ControlRight"]);
const ALT_CODES = new Set(["Alt", "AltLeft", "AltRight"]);
const SHIFT_CODES = new Set(["Shift", "ShiftLeft", "ShiftRight"]);

const MOD_CODES = new Set([
  ...Array.from(META_CODES),
  ...Array.from(CTRL_CODES),
  ...Array.from(ALT_CODES),
  ...Array.from(SHIFT_CODES),
]);

const MODIFIER_KEY_FLAGS = [
  "shiftKey",
  "altKey",
  "ctrlKey",
  "metaKey",
] as const;
export type ModifierKeyFlagName = (typeof MODIFIER_KEY_FLAGS)[number];

export type Key = {
  [K in ModifierKeyFlagName]: boolean;
} & {
  code: string;
};

export default class EventMatcher {
  constructor(private readonly key: Key) {}

  static parse(pattern: string) {
    return new EventMatcher(parseValue(pattern));
  }

  test(k: KeyboardEvent) {
    return (
      k.shiftKey === this.key.shiftKey &&
      k.altKey === this.key.altKey &&
      k.ctrlKey === this.key.ctrlKey &&
      k.metaKey === this.key.metaKey &&
      this.testModInsensitive(k)
    );
  }

  testModInsensitive(k: KeyboardEvent) {
    return this.key.code === k.code;
  }
}

function parseValue(pattern: string) {
  const splitted = pattern.split(" + ");
  const key = {
    altKey: false,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    code: "",
  };
  while (splitted.length !== 1) {
    const m = splitted.shift();
    switch (m) {
      case "Meta":
        key.metaKey = true;
        break;
      case "Ctrl":
        key.ctrlKey = true;
        break;
      case "Alt":
        key.altKey = true;
        break;
      case "Shift":
        key.shiftKey = true;
        break;
      default:
        throw Error(`Unexpected mod: ${m}`);
    }
  }
  key.code = splitted[0];
  return key;
}

interface BuildValueOptions {
  allowModOnly?: boolean;
  noMod?: boolean;
  ignore?: RegExp | null;
}

export function buildValue(key: Key, options: BuildValueOptions) {
  const code = key.code;
  if (!options.allowModOnly && isModKey(key.code)) {
    return null;
  }

  let value;
  if (options.noMod) {
    value = code;
  } else {
    const a = [code];
    if (key.metaKey && !isMetaKey(code)) a.unshift("Meta");
    if (key.ctrlKey && !isCtrlKey(code)) a.unshift("Ctrl");
    if (key.altKey && !isAltKey(code)) a.unshift("Alt");
    if (key.shiftKey && !isShiftKey(code)) a.unshift("Shift");
    value = a.join(" + ");
  }

  const ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(code: string) {
  return MOD_CODES.has(code);
}
function isMetaKey(code: string) {
  return META_CODES.has(code);
}
function isCtrlKey(code: string) {
  return CTRL_CODES.has(code);
}
function isAltKey(code: string) {
  return ALT_CODES.has(code);
}
function isShiftKey(code: string) {
  return SHIFT_CODES.has(code);
}
