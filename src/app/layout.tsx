import type { Metadata, Viewport } from "next";
import { Albert_Sans, Noto_Serif_Display } from "next/font/google";
import AppProviders from "../providers/AppProviders";
import "../styles/index.css";

// Self-hosted at build time: no request to Google at runtime and no layout shift.
// Only the weights the type scale uses: 300 for display sizes, 400 for smaller headings.
const serif = Noto_Serif_Display({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Albert_Sans({ subsets: ["latin"], variable: "--font-sans" });

const DESCRIPTION =
  "Veloura Beauty creates considered skincare, makeup, and rituals with effective formulas and sensorial textures.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Veloura Beauty", template: "%s | Veloura Beauty" },
  description: DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Veloura Beauty",
    title: "Veloura Beauty ",
    description: "High-performance beauty essentials made for daily ritual.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#2a231e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
