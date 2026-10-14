import { luminance, textOn } from "./contrast";

test("luminance spans black to white", () => {
  expect(luminance("#000000")).toBe(0);
  expect(luminance("#ffffff")).toBeCloseTo(1);
});

test("light shades get dark text and deep shades get light text", () => {
  expect(textOn("#ecd0b5")).toBe("var(--kohl)"); // 1W1 Bone
  expect(textOn("#7a4a30")).toBe("var(--powder)"); // 6W1 Sandalwood
});
