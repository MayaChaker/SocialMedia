"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, LockOutlined } from "@mui/icons-material";
import { useCommerce } from "../../hooks/useCommerce";
import { isHostedCheckout, orderService } from "../../services/orderService";
import type { ContactDetails, ShippingAddress } from "../../types/commerce";
import ContactStep from "./ContactStep";
import OrderSummary from "./OrderSummary";
import ReviewStep from "./ReviewStep";
import ShippingStep from "./ShippingStep";

const STEPS = ["Contact", "Shipping", "Review"];
const emptyContact: ContactDetails = { email: "", firstName: "", lastName: "", phone: "" };
const emptyShipping: ShippingAddress = {
  address: "",
  apartment: "",
  city: "",
  country: "Lebanon",
  postalCode: "",
};

/** Three-step checkout: contact, shipping, review. */
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
          <LockOutlined /> {isHostedCheckout ? "Secure checkout" : "Demo checkout"}
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
            <ContactStep contact={contact} setContact={setContact} onSubmit={goTo(2)} />
          )}
          {step === 2 && (
            <ShippingStep
              shipping={shipping}
              setShipping={setShipping}
              totals={totals}
              onSubmit={goTo(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <ReviewStep
              contact={contact}
              shipping={shipping}
              total={totals.total}
              placing={placing}
              error={checkoutError}
              onSubmit={placeOrder}
              onEdit={setStep}
            />
          )}
        </section>
        <OrderSummary cart={cart} totals={totals} promoCode={promoCode} />
      </div>
    </main>
  );
}
