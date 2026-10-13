import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

/** Header, skip link and footer shared by every storefront page (not checkout). */
export default function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="siteShell">
      <a className="skipLink" href="#mainContent">
        Skip to content
      </a>
      <Header />
      <div id="mainContent">{children}</div>
      <Footer />
    </div>
  );
}
