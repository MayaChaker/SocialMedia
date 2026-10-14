import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { MOTION_GATE_SCRIPT } from "../motion/motionGate";
import MotionReady from "../motion/MotionReady";
import AppProviders from "../providers/AppProviders";
import "../styles/index.css";

// Self-hosted at build time: no request to Google at runtime and no layout shift.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans" });

const DESCRIPTION =
  "Veloura is a multi-brand beauty store: makeup, skincare, fragrance and hair from the houses you love.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Veloura Beauty", template: "%s | Veloura Beauty" },
  description: DESCRIPTION,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Veloura Beauty",
    title: "Veloura Beauty",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#17131a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The motion gate adds data attributes to <html> before React hydrates.
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE_SCRIPT }} />
      </head>
      <body>
        <MotionReady />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
