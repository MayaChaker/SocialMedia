/** Relative luminance of a #rrggbb colour, as defined by WCAG 2. */
export function luminance(hex: string): number {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** The CSS colour token that stays legible on top of `hex`. */
export const textOn = (hex: string): string =>
  luminance(hex) > 0.3 ? "var(--kohl)" : "var(--powder)";
