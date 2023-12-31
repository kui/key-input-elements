export const modKeyCodes = {
  meta: new Set(["MetaLeft", "MetaRight"]),
  ctrl: new Set(["ControlLeft", "ControlRight"]),
  alt: new Set(["AltLeft", "AltRight"]),
  shift: new Set(["ShiftLeft", "ShiftRight"]),
} as const;
export const modKeyCodeList = Object.entries(modKeyCodes) as [
  ModName,
  Set<string>,
][];
export type ModName = keyof typeof modKeyCodes;
export const allModKeyCodes = new Set(
  Object.values(modKeyCodes).flatMap((s) => [...s]),
);
export function isModName(name: string): name is ModName {
  return Boolean((modKeyCodes as Record<string, unknown>)[name]);
}
export function isModKeyCode(code: string, mod?: ModName) {
  return mod ? modKeyCodes[mod].has(code) : allModKeyCodes.has(code);
}
