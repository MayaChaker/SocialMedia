import type { Metadata } from "next";
import StyleguidePage from "../../../views/StyleguidePage";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "The Veloura design system: tokens and shared components.",
  robots: { index: false },
};

export default function Page() {
  return <StyleguidePage />;
}
