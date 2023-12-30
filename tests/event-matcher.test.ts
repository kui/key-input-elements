import { EventMatcher } from "../ts/event-matcher.ts";

describe("EventMatcher", () => {
  describe("keydown", () => {
    it("should return a matcher", () => {
      const m = EventMatcher.parse("KeyA");

      const matcher1 = m.keydown({ code: "KeyA", type: "keydown" });
      expect(matcher1.match()).toBe(true);
      expect(matcher1.match({ rawMod: true })).toBe(true);
      expect(matcher1.match({ historySensitive: "orderSensitive" })).toBe(true);
      expect(matcher1.match({ historySensitive: "ignore" })).toBe(true);
      m.reset();

      const matcher2 = m.keydown({ code: "KeyB", type: "keydown" });
      expect(matcher2.match()).toBe(false);
      expect(matcher2.match({ rawMod: true })).toBe(false);
      expect(matcher2.match({ historySensitive: "orderSensitive" })).toBe(
        false,
      );
      expect(matcher2.match({ historySensitive: "ignore" })).toBe(false);
    });
    it("should return a matcher with modifier keys", () => {
      const m = EventMatcher.parse("Ctrl + KeyA");

      const matcher1 = m.keydown({
        type: "keydown",
        ctrlKey: true,
        code: "KeyA",
      });
      expect(matcher1.match()).toBe(true);
      expect(matcher1.match({ rawMod: true })).toBe(true);
      expect(matcher1.match({ historySensitive: "orderSensitive" })).toBe(true);
      expect(matcher1.match({ historySensitive: "ignore" })).toBe(true);
      m.reset();

      const matcher2 = m.keydown({
        type: "keydown",
        code: "KeyA",
      });
      expect(matcher2.match()).toBe(false);
      expect(matcher2.match({ rawMod: true })).toBe(true);
      expect(matcher2.match({ historySensitive: "orderSensitive" })).toBe(
        false,
      );
      expect(matcher2.match({ historySensitive: "ignore" })).toBe(false);
    });
    it("should return a matcher with multi keys", () => {
      const m = EventMatcher.parse("Ctrl + Alt + KeyA + KeyB + KeyC");
      const matcher1 = m.keydown({
        type: "keydown",
        ctrlKey: true,
        altKey: true,
        code: "KeyC",
      });
      expect(matcher1.match()).toBe(false);
      expect(matcher1.match({ rawMod: true })).toBe(false);
      expect(matcher1.match({ historySensitive: "orderSensitive" })).toBe(
        false,
      );
      expect(matcher1.match({ historySensitive: "ignore" })).toBe(true);
      m.reset();

      m.keydown({ type: "keydown", code: "KeyA" });
      m.keydown({ type: "keydown", code: "KeyB" });
      const matcher2 = m.keydown({
        type: "keydown",
        ctrlKey: true,
        altKey: true,
        code: "KeyC",
      });
      expect(matcher2.match()).toBe(true);
      expect(matcher2.match({ rawMod: true })).toBe(true);
      expect(matcher2.match({ historySensitive: "orderSensitive" })).toBe(true);
      expect(matcher2.match({ historySensitive: "ignore" })).toBe(true);
      m.reset();

      m.keydown({ type: "keydown", code: "KeyB" });
      m.keydown({ type: "keydown", code: "KeyA" });
      const matcher3 = m.keydown({
        type: "keydown",
        ctrlKey: true,
        altKey: true,
        code: "KeyC",
      });
      expect(matcher3.match()).toBe(true);
      expect(matcher3.match({ rawMod: true })).toBe(true);
      expect(matcher3.match({ historySensitive: "orderSensitive" })).toBe(
        false,
      );
      expect(matcher3.match({ historySensitive: "ignore" })).toBe(true);
    });
  });

  describe("keyup", () => {
    it("should return a matcher", () => {
      const m = EventMatcher.parse("KeyA");
      m.keydown({ type: "keydown", code: "KeyA" });
      const matcher = m.keyup({ type: "keyup", code: "KeyA" });
      expect(matcher.match()).toBe(true);
    });
  });
});
