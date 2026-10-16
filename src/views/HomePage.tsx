import BestsellerRail from "./home/BestsellerRail";
import CategoryDiscovery from "./home/CategoryDiscovery";
import HomeHero from "./home/HomeHero";
import NewIn from "./home/NewIn";
import ServicesRow from "./home/ServicesRow";
import ShopTheLook from "./home/ShopTheLook";

/** Inspire, then route to products: campaign, categories, bestsellers, a shoppable look, new in. */
export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <ServicesRow />
      <CategoryDiscovery />
      <BestsellerRail />
      <ShopTheLook />
      <NewIn />
    </main>
  );
}
