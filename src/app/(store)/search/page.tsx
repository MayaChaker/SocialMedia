import { Suspense } from "react";
import type { Metadata } from "next";
import ShopPage from "../../../features/products/ShopPage";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default function Page() {
  // The query is read from the URL (?q=), which is only known in the browser.
  return (
    <Suspense>
      <ShopPage search />
    </Suspense>
  );
}
