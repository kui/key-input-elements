// @flow
export interface EventMatcherOptions {
  allowModOnly?: boolean;
  noMod?: boolean;
  ignore?: ?RegExp;
}

const MOD_KEYS = new Set(["Shift", "Alt", "Control", "Meta"]);

const DEFAULT_OPTIONS = {
  allowModOnly: false,
  noMod: false,
  ignore: undefined,
};
export { DEFAULT_OPTIONS };

export default class EventMatcher {
  pattern: string;
  options: EventMatcherOptions;

  constructor(pattern: string, options?: EventMatcherOptions = DEFAULT_OPTIONS) {
    this.pattern = pattern;
    this.options = options;
  }

  test(event: Event) {
    if (!(event instanceof KeyboardEvent)) return false;
    if (this.pattern.length === 0) return false;
    const value = buildValue((event: KeyboardEvent), this.options);
    return this.pattern === value;
  }

  testModInsensitive(event: Event) {
    if (!(event instanceof KeyboardEvent)) return false;
    if (this.pattern.length === 0) return false;
    const opts = Object.assign(({ noMod: true }: any), this.options);
    const value = buildValue((event: KeyboardEvent), opts);
    return this.pattern === value;
  }
}

export function buildValue(event: KeyboardEvent, options: EventMatcherOptions): ?string {
  const code = event.code;
  if (!options.allowModOnly && isModKey(event.key)) {
    return null;
  }

  let value;
  if (options.noMod) {
    value = code;
  } else {
    const a = [code];
    if (event.shiftKey && !code.startsWith("Shift"))   a.unshift("Shift");
    if (event.altKey   && !code.startsWith("Alt"))     a.unshift("Alt");
    if (event.ctrlKey  && !code.startsWith("Control")) a.unshift("Control");
    if (event.metaKey  && !code.startsWith("Meta"))    a.unshift("Meta");
    value = a.join(" + ");
  }

  const ignore = options.ignore;
  if (ignore && ignore.test(value)) {
    return null;
  }
  return value;
}

function isModKey(key: string): boolean {
  return MOD_KEYS.has(key);
}
