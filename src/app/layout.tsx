import type { Metadata, Viewport } from "next";
import { DM_Sans, Italiana } from "next/font/google";
import AppProviders from "../providers/AppProviders";
import "../styles/index.css";

// Self-hosted at build time: no request to Google at runtime and no layout shift.
const serif = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-serif" });
const sans = DM_Sans({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const DESCRIPTION =
  "Veloura Beauty creates considered skincare, makeup, and rituals with effective formulas and sensorial textures.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Veloura Beauty — Beauty, considered.", template: "%s | Veloura Beauty" },
  description: DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Veloura Beauty",
    title: "Veloura Beauty — Beauty, considered.",
    description: "High-performance beauty essentials made for daily ritual.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#4a2730" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
