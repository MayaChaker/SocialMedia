import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Add,
  Close,
  LocalShippingOutlined,
  Remove,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { money } from "../../lib/money";
import { productRepository } from "../../repositories/productRepository";
import { useCommerce } from "../../hooks/useCommerce";
import { useModalDialog } from "../../hooks/useModalDialog";
import ProductArt from "../../components/product-art/ProductArt";
import { MOTION } from "../../theme/tokens";

const catalogue = productRepository.getAll();

export default function CartDrawer({ open, close }) {
  const {
    cart,
    totals,
    promoCode,
    updateQuantity,
    removeFromCart,
    addToCart,
    applyPromoCode,
    removePromoCode,
  } = useCommerce();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const closeRef = useRef(null);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const recommendation = catalogue.find(
    (product) => !product.variants && !cart.some((item) => item.productId === product.id),
  );
  useModalDialog(open, drawerRef, close, closeRef);
  const applyPromo = (event) => {
    event.preventDefault();
    const valid = applyPromoCode(promoInput);
    setPromoError(valid ? "" : "That code is not valid.");
    if (valid) setPromoInput("");
  };
  const checkout = () => {
    close();
    navigate("/checkout");
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
                    <article className="cartItem" key={item.cartId}>
                      <div className={`cartThumb ${item.color}`}>
                        <ProductArt product={item} />
                      </div>
                      <div className="cartItemDetails">
                        <strong>{item.name}</strong>
                        <small>
                          {item.selectedVariant && `Shade: ${item.selectedVariant} · `}
                          {item.size}
                        </small>
                        <div className="quantity">
                          <button
                            onClick={() => updateQuantity(item.cartId, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Remove />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            disabled={item.quantity >= (item.stock ?? 24)}
                            onClick={() => updateQuantity(item.cartId, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Add />
                          </button>
                        </div>
                      </div>
                      <div className="cartLinePrice">
                        {item.quantity > 1 && <small>{money(item.price)} each</small>}
                        <b>{money(item.price * item.quantity)}</b>
                        <button className="cartRemove" onClick={() => removeFromCart(item.cartId)}>
                          Remove
                        </button>
                      </div>
                    </article>
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
                  {promoCode ? (
                    <small className="promoSuccess" role="status">
                      {promoCode} applied · {totals.promotion?.label}{" "}
                      <button className="cartRemove" onClick={removePromoCode}>
                        Remove
                      </button>
                    </small>
                  ) : (
                    <>
                      <button
                        className="promoToggle"
                        onClick={() => setPromoOpen((value) => !value)}
                        aria-expanded={promoOpen}
                      >
                        Have a promo code?
                      </button>
                      {promoOpen && (
                        <form className="promo" onSubmit={applyPromo}>
                          <input
                            value={promoInput}
                            onChange={(event) => setPromoInput(event.target.value)}
                            placeholder="Promo code"
                            aria-label="Promo code"
                          />
                          <button>Apply</button>
                        </form>
                      )}
                      {promoError && (
                        <small className="promoError" role="status">
                          {promoError}
                        </small>
                      )}
                    </>
                  )}
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(totals.subtotal - totals.discount)}</strong>
                  </div>
                  <p className="shippingProgress">
                    <LocalShippingOutlined />
                    {totals.freeShippingRemaining > 0
                      ? `${money(totals.freeShippingRemaining)} away from complimentary delivery`
                      : "Your order qualifies for complimentary delivery"}
                  </p>
                  <button className="button dark full ripple" onClick={checkout}>
                    Checkout · {money(totals.subtotal - totals.discount)}
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
                <Link className="button dark" to="/shop" onClick={close}>
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
