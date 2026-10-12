import { Suspense } from "react";
import ShopPage from "../../../features/products/ShopPage";

export const metadata = {
  title: "Shop",
  description: "Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty.",
};

export default function Page() {
  // ShopPage reads filters from the query string, which is only known in the browser.
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
