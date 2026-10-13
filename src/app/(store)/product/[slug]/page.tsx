import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "../../../../features/products/ProductPage";
import { productRepository } from "../../../../repositories/productRepository";

// Every product page is pre-rendered at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return productRepository.getAll().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = productRepository.getBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    // Child openGraph objects replace the parent's, so the share image is repeated here.
    openGraph: {
      title: `${product.name} | Veloura Beauty`,
      description: product.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  if (!productRepository.getBySlug(slug)) notFound();
  return (
    <Suspense>
      <ProductPage slug={slug} />
    </Suspense>
  );
}
