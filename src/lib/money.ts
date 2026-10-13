export const money = (value: number | string): string => `$${Number(value).toFixed(2)}`;
