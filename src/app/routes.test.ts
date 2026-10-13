import CategoryRoute, {
  generateStaticParams as categoryParams,
} from "./(store)/shop/[category]/page";
import PolicyRoute from "./(store)/care/[policy]/page";
import ProductRoute, {
  generateMetadata as productMetadata,
  generateStaticParams as productParams,
} from "./(store)/product/[slug]/page";

const params = <T extends Record<string, string>>(value: T) => ({
  params: Promise.resolve(value),
  searchParams: Promise.resolve({}),
});

test.each([
  ["product", () => ProductRoute(params({ slug: "missing" }))],
  ["category", () => CategoryRoute(params({ category: "perfume" }))],
  ["policy", () => PolicyRoute(params({ policy: "unknown" }))],
])("an unknown %s renders the not-found page", async (_, render) => {
  await expect(render()).rejects.toThrow("NEXT_NOT_FOUND");
});

test("every product and category is pre-rendered", () => {
  expect(productParams()).toHaveLength(18);
  expect(categoryParams()).toEqual([
    { category: "skincare" },
    { category: "makeup" },
    { category: "sets" },
  ]);
});

test("product pages get their own title and description", async () => {
  await expect(productMetadata(params({ slug: "luminous-veil-serum" }))).resolves.toMatchObject({
    title: "Luminous Veil Serum",
    description: expect.stringContaining("concentrated daily serum"),
  });
});
