const toRgb = (hex: string): number[] => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

const toHex = (rgb: number[]): string =>
  `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;

/** Mixes `hex` towards white (amount > 0) or black (amount < 0). `amount` is -1..1. */
export function shade(hex: string, amount: number): string {
  const target = amount > 0 ? 255 : 0;
  const weight = Math.abs(amount);
  return toHex(toRgb(hex).map((channel) => channel + (target - channel) * weight));
}
