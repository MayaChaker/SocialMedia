import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopPage from "../../../../features/products/ShopPage";
import { CATEGORIES } from "../../../../features/products/shopLogic";

const TITLES: Record<string, string> = { skincare: "Skincare", makeup: "Makeup", sets: "Sets" };

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  return { title: TITLES[category] };
}

export default async function Page({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  if (!CATEGORIES.includes(category)) notFound();
  return (
    <Suspense>
      <ShopPage category={category} />
    </Suspense>
  );
}
