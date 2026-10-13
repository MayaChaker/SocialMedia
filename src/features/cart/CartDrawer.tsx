"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Close, LocalShippingOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { money } from "../../lib/money";
import { productRepository } from "../../repositories/productRepository";
import { useCommerce } from "../../hooks/useCommerce";
import { useModalDialog } from "../../hooks/useModalDialog";
import ProductArt from "../../components/product-art/ProductArt";
import { MOTION } from "../../theme/tokens";
import CartLineItem from "./CartLineItem";
import PromoCode from "./PromoCode";

const catalogue = productRepository.getAll();

interface CartDrawerProps {
  open: boolean;
  close: () => void;
}

/** Slide-in shopping bag with lines, a pairing suggestion, promo code and totals. */
export default function CartDrawer({ open, close }: CartDrawerProps) {
  const { cart, totals, updateQuantity, removeFromCart, addToCart } = useCommerce();
  const router = useRouter();
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Suggest the first single-shade product that is not in the bag yet.
  const recommendation = catalogue.find(
    (product) => !product.variants && !cart.some((item) => item.productId === product.id),
  );
  const merchandiseTotal = money(totals.subtotal - totals.discount);
  useModalDialog(open, drawerRef, close, closeRef);

  const checkout = () => {
    close();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className="drawerOverlay motionOverlay"
            aria-label="Close bag"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            ref={drawerRef}
            className="cartDrawer motionDrawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={MOTION.drawer}
            aria-modal="true"
            role="dialog"
            aria-label="Shopping bag"
          >
            <header className="cartHeader">
              <div>
                <span className="kicker">Your selection</span>
                <h2>Shopping bag</h2>
              </div>
              <button ref={closeRef} onClick={close} aria-label="Close bag">
                <Close />
              </button>
            </header>
            {cart.length ? (
              <>
                <div className="cartItems">
                  {cart.map((item) => (
                    <CartLineItem
                      key={item.cartId}
                      item={item}
                      onChangeQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                  {recommendation && (
                    <div className="cartRecommendation">
                      <span className="kicker">Pairs well</span>
                      <div>
                        <div className={`miniVisual ${recommendation.color}`}>
                          <ProductArt product={recommendation} />
                        </div>
                        <span>
                          <strong>{recommendation.name}</strong>
                          <small>{money(recommendation.price)}</small>
                        </span>
                        <button onClick={() => addToCart(recommendation)}>Add</button>
                      </div>
                    </div>
                  )}
                </div>
                <footer className="cartFooter">
                  <PromoCode />
                  <div>
                    <span>Subtotal</span>
                    <strong>{merchandiseTotal}</strong>
                  </div>
                  <p className="shippingProgress">
                    <LocalShippingOutlined />
                    {totals.freeShippingRemaining > 0
                      ? `${money(totals.freeShippingRemaining)} away from complimentary delivery`
                      : "Your order qualifies for complimentary delivery"}
                  </p>
                  <button className="button dark full ripple" onClick={checkout}>
                    Checkout · {merchandiseTotal}
                  </button>
                  <button className="textLink" onClick={close}>
                    Continue shopping
                  </button>
                </footer>
              </>
            ) : (
              <div className="emptyBag">
                <ShoppingBagOutlined />
                <h3>Your bag is waiting.</h3>
                <p>Explore considered skincare, colour, and sets.</p>
                <Link className="button dark" href="/shop" onClick={close}>
                  Shop the collection
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
