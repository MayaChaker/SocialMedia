import { notFound } from "next/navigation";
import PolicyPage, { POLICIES } from "../../../../views/PolicyPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((policy) => ({ policy }));
}

export async function generateMetadata({ params }) {
  const { policy } = await params;
  const content = POLICIES[policy];
  return content ? { title: content.title, description: content.intro } : {};
}

export default async function Page({ params }) {
  const { policy } = await params;
  const content = POLICIES[policy];
  if (!content) notFound();
  return <PolicyPage content={content} />;
}
