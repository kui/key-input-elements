import { CodeHistory } from "./code-history.js";

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

export interface EqualsOptions {
  modSensitive?: boolean;
  historySensitive?: "orderInsensitive" | "orderSensitive" | "ignore";
}

export interface ToStringOptions {
  /**
   * Strip modifier keys from the returned string.
   *
   * If `true`, the returned string will not contain any modifier keys like "Meta +" or "Shift +",
   * but the modifier codes like "+ MetaLeft", "+ ShiftLeft" will show history codes.
   * If `false`, the returned string will contain modifier keys, but the modifier code will not show history codes.
   *
   * @default false
   * @see {@link KeyInput#toString}
   */
  stripMod?: boolean;
  stripHistory?: boolean;
}

export class KeyInput implements KeyInputLike {
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly code: string;

  constructor(
    k: KeyInputLike,
    readonly history: CodeHistory,
  ) {
    this.shiftKey = k.shiftKey ?? false;
    this.altKey = k.altKey ?? false;
    this.ctrlKey = k.ctrlKey ?? false;
    this.metaKey = k.metaKey ?? false;
    this.code = k.code;
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
    const history = CodeHistory.fromCodes(splitted, "olderToNewer");
    return new KeyInput(key, history);
  }

  equals(
    other: KeyInput,
    {
      modSensitive = true,
      historySensitive = "orderInsensitive",
    }: EqualsOptions = {},
  ): boolean {
    if (this.code !== other.code) return false;

    if (modSensitive) {
      for (const [mod] of modKeyCodeList) {
        if (this[`${mod}Key`] !== other[`${mod}Key`]) return false;
      }
    }

    if (
      historySensitive === "orderInsensitive" &&
      !this.history.equals(other.history, false)
    ) {
      return false;
    } else if (
      historySensitive === "orderSensitive" &&
      !this.history.equals(other.history, true)
    ) {
      return false;
    }

    return true;
  }

  /**
   * @param options The options for the returned string.
   */
  toString({ stripMod = false, stripHistory = false }: ToStringOptions = {}) {
    const modKeys = stripMod
      ? []
      : capitalizedModKeyList
          .filter(([m]) => this[`${m}Key`] && !modKeyCodes[m].has(this.code))
          .map(([, m]) => m);
    let historyCodes = stripHistory
      ? []
      : this.history.codes("olderToNewer").filter((c) => c !== this.code);
    if (!stripMod) {
      historyCodes = historyCodes.filter((c) => !isModifierKey(c));
    }
    const codes = [...modKeys, ...historyCodes, this.code];
    return codes.join(" + ");
  }
}

export function isModifierKey(code: string, mod?: ModKeyString) {
  if (mod) {
    return modKeyCodes[mod].has(code);
  }
  return allModKeyCodes.has(code);
}
