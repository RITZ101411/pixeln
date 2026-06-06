const NAMED_COLORS: Record<string, number> = {
  black: 0x000000ff,
  white: 0xffffffff,
  red: 0xff0000ff,
  green: 0x00ff00ff,
  blue: 0x0000ffff,
  yellow: 0xffff00ff,
  cyan: 0x00ffffff,
  magenta: 0xff00ffff,
  transparent: 0x00000000,
};

export function parseColor(input: string | number): number {
  if (typeof input === "number") return input;
  const named = NAMED_COLORS[input.toLowerCase()];
  if (named !== undefined) return named;
  const hex = input.replace("#", "");
  if (hex.length === 6) return (parseInt(hex, 16) << 8 | 0xff) >>> 0;
  if (hex.length === 8) return parseInt(hex, 16) >>> 0;
  return 0x000000ff;
}
