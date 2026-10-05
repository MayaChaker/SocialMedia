import "../index.css";
import Providers from "./providers";
import AppShell from "./shell";

export const metadata = {
  title: "Veloura Beauty — Beauty, considered.",
  description: "Veloura Beauty creates considered skincare, makeup, and rituals with effective formulas and sensorial textures.",
  icons: { icon: "/veloura-hero.png" },
  openGraph: {
    title: "Veloura Beauty — Beauty, considered.",
    description: "High-performance beauty essentials made for daily ritual.",
    images: ["/veloura-hero.png"],
    type: "website",
    siteName: "Veloura Beauty",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veloura Beauty — Beauty, considered.",
    description: "High-performance beauty essentials made for daily ritual.",
  },
};

export const viewport = { themeColor: "#4a2730" };

export default function RootLayout({ children }) {
  return <html lang="en"><body><Providers><AppShell>{children}</AppShell></Providers></body></html>;
}
