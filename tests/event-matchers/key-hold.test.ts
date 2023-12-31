import { KeyHoldMatcher } from "../../ts/event-matchers/key-hold.ts";

function keydownSequence(m: KeyHoldMatcher, ...codes: string[]) {
  for (const code of codes) {
    m.keydown({ type: "keydown", code });
  }
}

describe("KeyHoldMatcher", () => {
  describe("keydown", () => {
    describe("with single key", () => {
      it("should match single same keydown", () => {
        const m = KeyHoldMatcher.parse("KeyA");

        const matcher1 = m.keydown({ code: "KeyA", type: "keydown" });
        expect(matcher1.match()).toBe(true);
        expect(matcher1.match({ rawMod: true })).toBe(true);
      });
      it("should match multi keydown containing target key", () => {
        const m = KeyHoldMatcher.parse("KeyA");

        keydownSequence(m, "KeyB", "KeyC");
        const matcher1 = m.keydown({ code: "KeyA", type: "keydown" });
        expect(matcher1.match()).toBe(true);
        expect(matcher1.match({ rawMod: true })).toBe(true);
      });
      it("should not match single different keydown", () => {
        const m = KeyHoldMatcher.parse("KeyA");

        const matcher1 = m.keydown({ code: "KeyB", type: "keydown" });
        expect(matcher1.match()).toBe(false);
        expect(matcher1.match({ rawMod: true })).toBe(false);
      });
    });
    describe("with modifier keys", () => {
      it("should match single same keydown with modifier keys", () => {
        const m = KeyHoldMatcher.parse("Ctrl + KeyA");

        m.keydown({ type: "keydown", ctrlKey: true, code: "ControlLeft" });
        const matcher1 = m.keydown({
          type: "keydown",
          ctrlKey: true,
          code: "KeyA",
        });
        expect(matcher1.match()).toBe(true);
        expect(matcher1.match({ rawMod: true })).toBe(true);
      });
      it("should not match single different keydown with modifier keys", () => {
        const m = KeyHoldMatcher.parse("Ctrl + KeyA");

        m.keydown({ type: "keydown", ctrlKey: true, code: "ControlLeft" });
        const matcher1 = m.keydown({
          type: "keydown",
          ctrlKey: true,
          code: "KeyB",
        });
        expect(matcher1.match()).toBe(false);
        expect(matcher1.match({ rawMod: true })).toBe(false);
      });
      it("should not match single same keydown with different modifier keys", () => {
        const m = KeyHoldMatcher.parse("Ctrl + KeyA");

        m.keydown({ type: "keydown", altKey: true, code: "AltLeft" });
        const matcher1 = m.keydown({
          type: "keydown",
          altKey: true,
          code: "KeyA",
        });
        expect(matcher1.match()).toBe(false);
        // rowMod ignores modifier keys
        expect(matcher1.match({ rawMod: true })).toBe(true);
        m.reset();
      });
      it("should match multi keydown containing target key with modifier keys", () => {
        const m = KeyHoldMatcher.parse("Ctrl + KeyA");

        m.keydown({ type: "keydown", ctrlKey: true, code: "ControlLeft" });
        keydownSequence(m, "KeyB", "KeyC", "ShiftLeft");
        const matcher1 = m.keydown({
          type: "keydown",
          ctrlKey: true,
          shiftKey: true,
          code: "KeyA",
        });
        expect(matcher1.match()).toBe(true);
        expect(matcher1.match({ rawMod: true })).toBe(true);
      });
    });
  });
  describe("keyup", () => {
    describe("with single key", () => {
      it("should match same hold key even if other key was released", () => {
        const m = KeyHoldMatcher.parse("KeyA");
        keydownSequence(m, "KeyA", "KeyB");
        const matcher1 = m.keyup({ code: "KeyB", type: "keyup" });
        expect(matcher1.match()).toBe(true);
        expect(matcher1.match({ rawMod: true })).toBe(true);
      });
      it("should not match different hold key", () => {
        const m = KeyHoldMatcher.parse("KeyA");
        keydownSequence(m, "KeyA", "KeyB", "KeyC");
        const matcher1 = m.keyup({ code: "KeyA", type: "keyup" });
        expect(matcher1.match()).toBe(false);
        expect(matcher1.match({ rawMod: true })).toBe(false);
      });
    });
  });
});
