export class CodeHistory {
  /**
   * Newer codes are at the beginning of the array.
   */
  private history: string[] = [];

  /**
   * Index of the current code.
   */
  private set = new Set<string>();

  static fromCodes(codes: string[], order: "newerToOlder" | "olderToNewer") {
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
  putAll(codes: string[], order: "newerToOlder" | "olderToNewer") {
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
  codes(order: "newerToOlder" | "olderToNewer") {
    return order === "newerToOlder"
      ? [...this.history]
      : this.history.toReversed();
  }

  equals(other: CodeHistory, orderSensitive = true) {
    if (this === other) return true;
    if (this.history.length !== other.history.length) return false;
    if (orderSensitive) {
      return this.history.every((c, i) => c === other.history[i]);
    } else {
      return this.history.every((c) => other.has(c));
    }
  }

  copy() {
    return CodeHistory.fromCodes(this.history, "newerToOlder");
  }
}
