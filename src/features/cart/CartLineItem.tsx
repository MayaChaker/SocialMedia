import { Add, Remove } from "@mui/icons-material";
import { money } from "../../lib/money";
import ProductVisual from "../../components/product-art/ProductVisual";
import type { CartLine } from "../../types/commerce";

const DEFAULT_STOCK = 24;

interface CartLineItemProps {
  item: CartLine;
  onChangeQuantity: (cartId: string, delta: number) => void;
  onRemove: (cartId: string) => void;
}

/** One bag line: art, shade, quantity stepper (capped at stock) and line price. */
export default function CartLineItem({ item, onChangeQuantity, onRemove }: CartLineItemProps) {
  return (
    <article className="cartItem">
      <div className={`cartThumb ${item.color}`}>
        <ProductVisual product={item} sizes="100px" />
      </div>
      <div className="cartItemDetails">
        <strong>{item.name}</strong>
        <small>
          {item.selectedVariant && `Shade: ${item.selectedVariant} · `}
          {item.size}
        </small>
        <div className="quantity">
          <button
            onClick={() => onChangeQuantity(item.cartId, -1)}
            aria-label={`Decrease ${item.name} quantity`}
          >
            <Remove />
          </button>
          <span>{item.quantity}</span>
          <button
            disabled={item.quantity >= (item.stock ?? DEFAULT_STOCK)}
            onClick={() => onChangeQuantity(item.cartId, 1)}
            aria-label={`Increase ${item.name} quantity`}
          >
            <Add />
          </button>
        </div>
      </div>
      <div className="cartLinePrice">
        {item.quantity > 1 && <small>{money(item.price)} each</small>}
        <b>{money(item.price * item.quantity)}</b>
        <button className="cartRemove" onClick={() => onRemove(item.cartId)}>
          Remove
        </button>
      </div>
    </article>
  );
}
