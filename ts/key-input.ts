import type { ModName } from "./key-codes.js";
import { CodeHistory } from "./code-history.js";
import { modKeyCodes, modKeyCodeList, isModName } from "./key-codes.js";
import { isModKeyCode } from "./key-codes.js";

type ModFlagName<M extends ModName = ModName> = `${M}Key`;
export interface KeyInputLike extends Partial<Record<ModFlagName, boolean>> {
  code: string;
}

const capitalizedModKeys = Object.fromEntries(
  modKeyCodeList.map(([mod]) => [
    mod,
    (mod[0].toUpperCase() + mod.slice(1)) as Capitalize<typeof mod>,
  ]),
) as Record<ModName, Capitalize<ModName>>;
const capitalizedModKeyList = Object.entries(capitalizedModKeys) as [
  ModName,
  Capitalize<ModName>,
][];

export interface KeyInputEqualsOptions {
  /**
   * Treat modifier keys as normal keys. Modifiers such as `Ctrl` and
   * `Shift` are ignored to match as normal keys because they can't be
   * convert into normal keys.
   *
   * @default false
   */
  rawMod?: boolean;

  /**
   * How to compare history.
   *
   * @default "orderInsensitive"
   */
  historySensitive?: "orderInsensitive" | "orderSensitive" | "ignore";
}

export interface KeyInputToStringOptions {
  /**
   * Treat modifier keys as normal keys.
   *
   * @default false
   */
  rawMod?: boolean;
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

  /**
   * Parse a key string.
   *
   * The string is the following format:
   *
   * ```
   * [<mod-key> + ... +][<holding-key> + ... +]<new-key>
   * ```
   *
   * `<mod-key>` is one of `Ctrl`, `Alt`, `Shift`, `Meta`.
   *
   * `<holding-key>` and `<newer-key>` are key codes.
   *
   * The order of `<holding-key>` and `<new-key>` is older to newer.
   *
   * Example1: Represent to hold any `Shift` key, then press `A` key.
   *
   * ```
   * Shift + KeyA
   * ```
   *
   * Example2: Represent to hold `A` then `S`, then press `D` key.
   *
   * ```
   * KeyA + KeyS + KeyD
   * ```
   *
   */
  static parse(pattern: string): KeyInput {
    const splitted = pattern.split(/ *\+ */);
    const key: KeyInputLike = { code: "" };
    const history = new CodeHistory();

    // Parse modifier keys
    while (splitted.length > 1) {
      const m = splitted[0].toLowerCase();
      if (isModName(m)) {
        key[`${m}Key`] = true;
        splitted.shift();
        continue;
      }
      // Reach here if `m` is not a modifier key.
      break;
    }

    // Parse holding keys
    while (splitted.length > 1) {
      const c = splitted[0];
      history.put(c);
      const modFlag = codeToModFlag(c);
      if (modFlag) key[modFlag] = true;
      splitted.shift();
    }

    // parse new key
    key.code = splitted.pop() ?? "";
    if (key.code === "") {
      console.warn("Invalid key pattern: %s", pattern);
    }
    return new KeyInput(key, history);
  }

  equals(
    other: KeyInput,
    {
      rawMod = false,
      historySensitive = "orderInsensitive",
    }: KeyInputEqualsOptions = {},
  ): boolean {
    if (this.code !== other.code) return false;

    // match modifier
    if (!rawMod) {
      for (const [mod] of modKeyCodeList)
        if (this[`${mod}Key`] !== other[`${mod}Key`]) return false;
    }

    // match history
    if (historySensitive !== "ignore") {
      const orderSensitive = historySensitive === "orderSensitive";
      const matchHistory = this.history.equals(other.history, {
        orderSensitive,
        ignoreMod: !rawMod,
      });
      if (!matchHistory) return false;
    }

    return true;
  }

  /**
   * @param options The options for the returned string.
   */
  toString({
    rawMod = false,
    stripHistory = false,
  }: KeyInputToStringOptions = {}) {
    const modKeys = rawMod
      ? []
      : capitalizedModKeyList
          .filter(([m]) => this[`${m}Key`] && !modKeyCodes[m].has(this.code))
          .map(([, m]) => m);
    let historyCodes = stripHistory
      ? []
      : this.history.codes("olderToNewer").filter((c) => c !== this.code);
    if (!rawMod) {
      historyCodes = historyCodes.filter((c) => !isModKeyCode(c));
    }
    const codes = [...modKeys, ...historyCodes, this.code];
    return codes.join(" + ");
  }
}

function codeToModFlag(code: string): ModFlagName | null {
  for (const [mod, codes] of modKeyCodeList) {
    if (codes.has(code)) return `${mod}Key`;
  }
  return null;
}
