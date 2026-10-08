import AboutPage from "../../pages/AboutPage";
import { NextLink } from "../navigation";

export const metadata = {
  title: "Our Story | Veloura Beauty",
  description: "High-performance beauty essentials made for daily ritual.",
};

export default function Page() {
  return <AboutPage LinkComponent={NextLink}/>;
}
