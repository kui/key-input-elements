export const modKeyCodes = {
  meta: new Set(["MetaLeft", "MetaRight"]),
  ctrl: new Set(["ControlLeft", "ControlRight"]),
  alt: new Set(["AltLeft", "AltRight"]),
  shift: new Set(["ShiftLeft", "ShiftRight"]),
} as const;
export const modKeyCodeList = Object.entries(modKeyCodes) as [
  ModKeyString,
  Set<string>,
][];
export type ModKeyString = keyof typeof modKeyCodes;
export const allModKeyCodes = new Set(
  Object.values(modKeyCodes).flatMap((s) => [...s]),
);
