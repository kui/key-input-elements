import { CodeHistory } from "../ts/code-history.ts";

describe("CodeHistory", () => {
  describe("put", () => {
    it("should put a code", () => {
      const h = new CodeHistory();
      h.put("KeyA");
      expect(h.codes("newerToOlder")).toEqual(["KeyA"]);
    });
    it("should put a code in order", () => {
      const h = new CodeHistory();
      h.put("KeyA");
      h.put("KeyB");
      expect(h.codes("newerToOlder")).toEqual(["KeyB", "KeyA"]);
    });
    it("should put a code even if it is already in the history", () => {
      const h = new CodeHistory();
      h.put("KeyA");
      h.put("KeyB");
      h.put("KeyA");
      expect(h.codes("newerToOlder")).toEqual(["KeyA", "KeyB"]);
    });
  });
  describe("equals", () => {
    it("should return true if the histories are same", () => {
      const h1 = new CodeHistory();
      h1.put("KeyA");
      h1.put("KeyB");
      const h2 = new CodeHistory();
      h2.put("KeyA");
      h2.put("KeyB");
      expect(h1.equals(h2)).toBe(true);
      expect(h1.equals(h2, { orderSensitive: false })).toBe(true);
    });
    it("should return false if the histories are different", () => {
      const h1 = new CodeHistory();
      h1.put("KeyA");
      h1.put("KeyB");
      const h2 = new CodeHistory();
      h2.put("KeyA");
      h2.put("KeyC");
      expect(h1.equals(h2)).toBe(false);
      expect(h1.equals(h2, { orderSensitive: false })).toBe(false);
    });
    it("should return true if the histories are same even if the order is different", () => {
      const h1 = new CodeHistory();
      h1.put("KeyA");
      h1.put("KeyB");
      const h2 = new CodeHistory();
      h2.put("KeyB");
      h2.put("KeyA");
      expect(h1.equals(h2)).toBe(false);
      expect(h1.equals(h2, { orderSensitive: false })).toBe(true);
    });
    it("should return true if the histories are same except for modifier keys", () => {
      const h1 = new CodeHistory();
      h1.put("ShiftLeft");
      h1.put("KeyA");
      h1.put("KeyB");
      const h2 = new CodeHistory();
      h2.put("KeyA");
      h2.put("KeyB");
      expect(h1.equals(h2)).toBe(false);
      expect(h1.equals(h2, { ignoreMod: true })).toBe(true);
    });
  });
});
