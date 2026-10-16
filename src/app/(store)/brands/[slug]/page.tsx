import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANDS, getBrand } from "../../../../data/brands";
import ShopPage from "../../../../features/products/ShopPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const brand = getBrand((await params).slug);
  return brand
    ? {
        title: brand.name,
        description: `Shop ${brand.name} at Veloura: ${brand.productCount} ${
          brand.productCount === 1 ? "product" : "products"
        }.`,
      }
    : {};
}

export default async function Page({ params }: PageProps<"/brands/[slug]">) {
  const { slug } = await params;
  if (!getBrand(slug)) notFound();
  return (
    <Suspense>
      <ShopPage brandSlug={slug} />
    </Suspense>
  );
}
