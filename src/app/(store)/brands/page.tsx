import type { Metadata } from "next";
import BrandsPage from "../../../views/BrandsPage";

export const metadata: Metadata = {
  title: "Brands A–Z",
  description: "Every brand at Veloura, from Anastasia Beverly Hills to Yves Saint Laurent.",
};

export default function Page() {
  return <BrandsPage />;
}
