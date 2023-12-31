import { allModKeyCodes } from "./key-codes.js";

export type CodeOrder = "newerToOlder" | "olderToNewer";

export interface CodeHistoryEqualsOptions {
  orderSensitive?: boolean;
  ignoreMod?: boolean;
}

export class CodeHistory {
  /**
   * Newer codes are at the beginning of the array.
   */
  private history: string[] = [];

  /**
   * Index of the current code.
   */
  private set = new Set<string>();

  static fromCodes(codes: string[], order: CodeOrder) {
    const h = new CodeHistory();
    h.putAll(codes, order);
    return h;
  }

  put(code: string) {
    if (this.history[0] === code) return;
    if (this.set.has(code)) {
      this.history.splice(this.history.indexOf(code), 1);
    }
    this.history.unshift(code);
    this.set.add(code);
  }

  /**
   *
   * @param codes put codes in this order.
   * @param order The order of `codes`.
   */
  putAll(codes: string[], order: CodeOrder) {
    const ordered = order === "olderToNewer" ? codes : codes.toReversed();
    for (const c of ordered) this.put(c);
  }

  remove(code: string) {
    this.history = this.history.filter((c) => c !== code);
    this.set.delete(code);
  }

  has(code: string) {
    return this.set.has(code);
  }

  /**
   * @param order The order of the returned array.
   * @returns codes in this order.
   */
  codes(order: CodeOrder) {
    return order === "newerToOlder"
      ? [...this.history]
      : this.history.toReversed();
  }

  last(): string | undefined {
    return this.history[0];
  }

  equals(
    other: CodeHistory,
    { orderSensitive = true, ignoreMod = false }: CodeHistoryEqualsOptions = {},
  ) {
    if (this === other) return true;
    let thisHistory = this.history;
    let otherHistory = other.history;
    if (ignoreMod) {
      thisHistory = thisHistory.filter((c) => !allModKeyCodes.has(c));
      otherHistory = otherHistory.filter((c) => !allModKeyCodes.has(c));
    }
    if (thisHistory.length !== otherHistory.length) return false;
    if (orderSensitive) {
      return thisHistory.every((c, i) => c === otherHistory[i]);
    } else {
      return thisHistory.every((c) => other.has(c));
    }
  }

  isSubsetOf(
    other: CodeHistory,
    { ignoreMod = false }: { ignoreMod: boolean },
  ): boolean {
    if (ignoreMod) {
      return this.history.every((c) => allModKeyCodes.has(c) || other.has(c));
    } else {
      return this.history.every((c) => other.has(c));
    }
  }

  copy() {
    return CodeHistory.fromCodes(this.history, "newerToOlder");
  }

  clear() {
    this.history = [];
    this.set.clear();
  }

  toString() {
    return `CodeHistory(${this.history.join(", ")})`;
  }
}
