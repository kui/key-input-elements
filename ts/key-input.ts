const modKeyCodes = {
  meta: new Set(["MetaLeft", "MetaRight"]),
  ctrl: new Set(["ControlLeft", "ControlRight"]),
  alt: new Set(["AltLeft", "AltRight"]),
  shift: new Set(["ShiftLeft", "ShiftRight"]),
} as const;
const modKeyCodeList = Object.entries(modKeyCodes) as [
  ModKeyString,
  Set<string>,
][];
type ModKeyString = keyof typeof modKeyCodes;
type ModKeyFlagName<M extends ModKeyString = ModKeyString> = `${M}Key`;
export interface KeyInputLike extends Partial<Record<ModKeyFlagName, boolean>> {
  code: string;
}

const capitalizedModKeys = Object.fromEntries(
  modKeyCodeList.map(([mod]) => [
    mod,
    (mod[0].toUpperCase() + mod.slice(1)) as Capitalize<typeof mod>,
  ]),
) as Record<ModKeyString, Capitalize<ModKeyString>>;
const capitalizedModKeyList = Object.entries(capitalizedModKeys) as [
  ModKeyString,
  Capitalize<ModKeyString>,
][];

const allModKeyCodes = new Set(
  Object.values(modKeyCodes).flatMap((s) => [...s]),
);

export class KeyInput implements KeyInputLike {
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly code: string;
  readonly historyCodes: string[];

  constructor(k: KeyInputLike, historyCodes: string[] = []) {
    this.shiftKey = k.shiftKey ?? false;
    this.altKey = k.altKey ?? false;
    this.ctrlKey = k.ctrlKey ?? false;
    this.metaKey = k.metaKey ?? false;
    this.code = k.code;
    this.historyCodes = historyCodes;
  }

  static parse(pattern: string) {
    const splitted = pattern.split(/ *\+ */);
    const key: KeyInputLike = { code: "" };
    while (splitted.length > 1) {
      const m = splitted[0];
      for (const [mod, capitalized] of capitalizedModKeyList) {
        if (m === capitalized) {
          key[`${mod}Key`] = true;
          splitted.shift();
          continue;
        }
      }
      break;
    }
    key.code = splitted.pop() ?? "";
    if (key.code === "") {
      console.warn("Invalid key pattern: %s", pattern);
    }
    return new KeyInput(key, splitted);
  }

  toString() {
    const a = [];
    let historyCodes = [...this.historyCodes];
    for (const [mod, codes] of modKeyCodeList) {
      if (this[`${mod}Key`] && !isModifierKey(this.code, mod)) {
        a.push(capitalizedModKeys[mod]);
        historyCodes = historyCodes.filter((c) => !codes.has(c));
      }
    }
    a.push(...historyCodes);
    a.push(this.code);
    return a.join(" + ");
  }
}

export function isModifierKey(code: string, mod?: ModKeyString) {
  if (mod) {
    return modKeyCodes[mod].has(code);
  }
  return allModKeyCodes.has(code);
}
