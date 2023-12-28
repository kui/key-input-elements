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

const MOD_KEY_FLAGS = ["shiftKey", "altKey", "ctrlKey", "metaKey"] as const;
export type ModKeyFlagName = (typeof MOD_KEY_FLAGS)[number];

export type KeyInputLike = {
  [K in ModKeyFlagName]?: boolean;
} & {
  code: string;
};

export class KeyInput implements KeyInputLike {
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly code: string;

  constructor(k: KeyInputLike) {
    this.shiftKey = k.shiftKey ?? false;
    this.altKey = k.altKey ?? false;
    this.ctrlKey = k.ctrlKey ?? false;
    this.metaKey = k.metaKey ?? false;
    this.code = k.code;
  }

  static parse(pattern: string) {
    const splitted = pattern.split(/ *\+ */);
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
    return new KeyInput(key);
  }

  toString() {
    const a = [this.code];
    if (this.shiftKey && !isShiftKey(this)) a.unshift("Shift");
    if (this.altKey && !isAltKey(this)) a.unshift("Alt");
    if (this.ctrlKey && !isCtrlKey(this)) a.unshift("Ctrl");
    if (this.metaKey && !isMetaKey(this)) a.unshift("Meta");
    return a.join(" + ");
  }
}

export function isModKey(key: KeyInputLike) {
  return MOD_CODES.has(key.code);
}
export function isMetaKey(key: KeyInputLike) {
  return META_CODES.has(key.code);
}
export function isCtrlKey(key: KeyInputLike) {
  return CTRL_CODES.has(key.code);
}
export function isAltKey(key: KeyInputLike) {
  return ALT_CODES.has(key.code);
}
export function isShiftKey(key: KeyInputLike) {
  return SHIFT_CODES.has(key.code);
}
