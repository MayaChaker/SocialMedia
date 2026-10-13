"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, LockOutlined } from "@mui/icons-material";
import { FREE_SHIPPING_THRESHOLD } from "../../domain/commerce/commerceConfig";
import { money } from "../../lib/money";
import { useCommerce } from "../../hooks/useCommerce";
import { orderService } from "../../services/orderService";
import type { CartLine, ContactDetails, ShippingAddress, Totals } from "../../types/commerce";

const STEPS = ["Contact", "Shipping", "Review"];
const emptyContact: ContactDetails = { email: "", firstName: "", lastName: "", phone: "" };
const emptyShipping: ShippingAddress = {
  address: "",
  apartment: "",
  city: "",
  country: "Lebanon",
  postalCode: "",
};
const hostedCheckout = Boolean(process.env.NEXT_PUBLIC_CHECKOUT_URL);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, hydrated, totals, promoCode, addOrder, clearCart } = useCommerce();
  const [step, setStep] = useState(1);
  const [contact, setContact] = useState(emptyContact);
  const [shipping, setShipping] = useState(emptyShipping);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const emptyBag = hydrated && !cart.length && !placed;

  // Wait until the saved bag has loaded before deciding it is empty.
  useEffect(() => {
    if (emptyBag) router.replace("/shop");
  }, [emptyBag, router]);

  if (!hydrated || !cart.length) return null;

  /** Wires an input to one string field of a form state object. */
  const bind = <K extends string, T extends Record<K, string>>(
    setter: Dispatch<SetStateAction<T>>,
    values: T,
    key: K,
  ) => ({
    name: key,
    value: values[key],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setter((current) => ({ ...current, [key]: event.target.value })),
  });
  // Each step is a real <form>, so the browser validates required fields and email format.
  const goTo = (nextStep: number) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(nextStep);
  };

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlacing(true);
    setCheckoutError("");
    try {
      const order = await orderService.create({
        cart,
        contact,
        shipping,
        promoCode,
        total: totals.total,
      });
      if ("redirectUrl" in order) {
        window.location.assign(order.redirectUrl);
        return;
      }
      addOrder(order);
      setPlaced(true);
      router.replace(`/checkout/confirmation/${order.id}`);
      clearCart();
    } catch (error) {
      setCheckoutError(
        (error instanceof Error && error.message) || "Checkout could not be started.",
      );
      setPlacing(false);
    }
  };

  return (
    <main className="checkoutPage">
      <header>
        <button onClick={() => router.back()}>
          <ChevronLeft /> Back
        </button>
        <Link className="wordmark" href="/">
          VELOURA<span>BEAUTY</span>
        </Link>
        <span>
          <LockOutlined /> {hostedCheckout ? "Secure checkout" : "Demo checkout"}
        </span>
      </header>
      <div className="checkoutLayout">
        <section className="checkoutForm">
          <ol className="checkoutSteps" aria-label="Checkout progress">
            {STEPS.map((label, index) => (
              <li
                className={step >= index + 1 ? "active" : ""}
                aria-current={step === index + 1 ? "step" : undefined}
                key={label}
              >
                <i>{index + 1}</i>
                {label}
              </li>
            ))}
          </ol>
          {step === 1 && (
            <CheckoutSection
              title="Your details"
              copy="We’ll use these details only for your order updates."
              onSubmit={goTo(2)}
            >
              <div className="formGrid">
                <Field
                  label="Email"
                  type="email"
                  autoComplete="email"
                  wide
                  {...bind(setContact, contact, "email")}
                />
                <Field
                  label="First name"
                  autoComplete="given-name"
                  {...bind(setContact, contact, "firstName")}
                />
                <Field
                  label="Last name"
                  autoComplete="family-name"
                  {...bind(setContact, contact, "lastName")}
                />
                <Field
                  label="Phone"
                  type="tel"
                  autoComplete="tel"
                  optional
                  wide
                  {...bind(setContact, contact, "phone")}
                />
              </div>
              <button className="button dark checkoutNext">
                Continue to shipping <ChevronRight />
              </button>
            </CheckoutSection>
          )}
          {step === 2 && (
            <CheckoutSection
              title="Where should we send it?"
              copy={
                totals.shipping === 0
                  ? "Your order qualifies for complimentary standard delivery."
                  : `Standard delivery is ${money(totals.shipping)}; spend ${money(totals.freeShippingRemaining)} more for complimentary delivery over ${money(FREE_SHIPPING_THRESHOLD)}.`
              }
              onSubmit={goTo(3)}
            >
              <div className="formGrid">
                <Field
                  label="Address"
                  autoComplete="address-line1"
                  wide
                  {...bind(setShipping, shipping, "address")}
                />
                <Field
                  label="Apartment"
                  autoComplete="address-line2"
                  optional
                  wide
                  {...bind(setShipping, shipping, "apartment")}
                />
                <Field
                  label="City"
                  autoComplete="address-level2"
                  {...bind(setShipping, shipping, "city")}
                />
                <Field
                  label="Postal code"
                  autoComplete="postal-code"
                  optional
                  {...bind(setShipping, shipping, "postalCode")}
                />
                <Field
                  label="Country"
                  autoComplete="country-name"
                  wide
                  {...bind(setShipping, shipping, "country")}
                />
              </div>
              <div className="stepActions">
                <button type="button" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="button dark">
                  Review order <ChevronRight />
                </button>
              </div>
            </CheckoutSection>
          )}
          {step === 3 && (
            <CheckoutSection
              title="Review and place order"
              copy={
                hostedCheckout
                  ? "You will continue to our secure payment partner."
                  : "Payment is a demo until a secure checkout endpoint is configured."
              }
              onSubmit={placeOrder}
            >
              <div className="reviewDetails">
                <div>
                  <span>Contact</span>
                  <p>
                    {contact.firstName} {contact.lastName}
                    <br />
                    {contact.email}
                  </p>
                  <button type="button" onClick={() => setStep(1)}>
                    Edit
                  </button>
                </div>
                <div>
                  <span>Shipping</span>
                  <p>
                    {shipping.address}
                    {shipping.apartment && `, ${shipping.apartment}`}
                    <br />
                    {shipping.city}, {shipping.country}
                  </p>
                  <button type="button" onClick={() => setStep(2)}>
                    Edit
                  </button>
                </div>
                <div>
                  <span>Payment</span>
                  <p>
                    {hostedCheckout
                      ? "Hosted secure payment"
                      : "Demo payment · No charge will be made"}
                  </p>
                </div>
              </div>
              {checkoutError && (
                <p className="checkoutError" role="alert">
                  {checkoutError}
                </p>
              )}
              <button className="button dark full" disabled={placing}>
                {placing
                  ? "Placing order…"
                  : `${hostedCheckout ? "Continue to payment" : "Place demo order"} · ${money(totals.total)}`}
              </button>
            </CheckoutSection>
          )}
        </section>
        <OrderSummary cart={cart} totals={totals} promoCode={promoCode} />
      </div>
    </main>
  );
}

interface CheckoutSectionProps {
  title: string;
  copy: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

function CheckoutSection({ title, copy, onSubmit, children }: CheckoutSectionProps) {
  return (
    <form className="checkoutSection" onSubmit={onSubmit}>
      <span className="kicker">Step details</span>
      <h1>{title}</h1>
      <p>{copy}</p>
      {children}
    </form>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Spans both grid columns. */
  wide?: boolean;
  optional?: boolean;
}

function Field({ label, wide, optional = false, ...props }: FieldProps) {
  return (
    <label className={wide ? "wide" : ""}>
      <span>
        {label}
        {optional && " (optional)"}
      </span>
      <input required={!optional} {...props} />
    </label>
  );
}

interface OrderSummaryProps {
  cart: CartLine[];
  totals: Totals;
  promoCode: string;
}

function OrderSummary({ cart, totals, promoCode }: OrderSummaryProps) {
  return (
    <aside className="checkoutSummary">
      <h2>Order summary</h2>
      {cart.map((item) => (
        <div className="summaryItem" key={item.cartId}>
          <span>{item.quantity}×</span>
          <div>
            <strong>{item.name}</strong>
            <small>
              {item.selectedVariant && `${item.selectedVariant} · `}
              {item.size}
            </small>
          </div>
          <b>{money(item.price * item.quantity)}</b>
        </div>
      ))}
      <div className="summaryTotals">
        <p>
          <span>Subtotal</span>
          <b>{money(totals.subtotal)}</b>
        </p>
        {totals.discount > 0 && (
          <p>
            <span>Promotion ({promoCode})</span>
            <b>−{money(totals.discount)}</b>
          </p>
        )}
        <p>
          <span>Delivery</span>
          <b>{totals.shipping ? money(totals.shipping) : "Complimentary"}</b>
        </p>
        <p className="total">
          <span>Total</span>
          <b>{money(totals.total)}</b>
        </p>
      </div>
    </aside>
  );
}
