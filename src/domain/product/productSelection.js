import { productRepository } from "../../repositories/productRepository";

export function resolveProductSelection(productOrId, variantId = "") {
  const id = typeof productOrId === "object" ? (productOrId.productId || productOrId.id) : productOrId;
  const product = productRepository.getById(id);
  if (!product) return null;
  const requestedVariant = variantId || (typeof productOrId === "object" ? productOrId.variantId : "");
  const variant = product.variants?.find((item) => item.id === requestedVariant);
  return variant
    ? { ...product, ...variant, name: product.name, productId: product.id, variantId: variant.id, selectedVariant: variant.name, cartId: `${product.id}:${variant.id}` }
    : { ...product, productId: product.id, cartId: String(product.id) };
}
