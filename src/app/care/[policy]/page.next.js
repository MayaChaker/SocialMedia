import PolicyPage from "../../../pages/PolicyPage";
import { resolvePolicy } from "../../../pages/policies";
import { NextLink } from "../../navigation";

export async function generateMetadata({ params }) {
  const { policy } = await params;
  const content = resolvePolicy(policy);
  return {
    title: `${content.title} | Veloura Beauty`,
    description: content.intro,
  };
}

export default async function Page({ params }) {
  const { policy } = await params;
  return <PolicyPage policy={policy} LinkComponent={NextLink}/>;
}
