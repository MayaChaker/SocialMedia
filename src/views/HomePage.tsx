import BestsellerRail from "./home/BestsellerRail";
import BrandIndex from "./home/BrandIndex";
import CategoryDiscovery from "./home/CategoryDiscovery";
import HomeHero from "./home/HomeHero";
import NewIn from "./home/NewIn";
import ServicesRow from "./home/ServicesRow";

/** Inspire, then route to products: campaign, categories, bestsellers, brands, new in. */
export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ServicesRow />
      <CategoryDiscovery />
      <BestsellerRail />
      <BrandIndex />
      <NewIn />
    </main>
  );
}
