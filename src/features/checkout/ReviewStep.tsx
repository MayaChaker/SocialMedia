import type { FormEvent } from "react";
import { money } from "../../lib/money";
import { isHostedCheckout } from "../../services/orderService";
import type { ContactDetails, ShippingAddress } from "../../types/commerce";
import { CheckoutSection } from "./CheckoutFields";

interface ReviewStepProps {
  contact: ContactDetails;
  shipping: ShippingAddress;
  total: number;
  placing: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (step: 1 | 2) => void;
}

export default function ReviewStep({
  contact,
  shipping,
  total,
  placing,
  error,
  onSubmit,
  onEdit,
}: ReviewStepProps) {
  return (
    <CheckoutSection
      title="Review and place order"
      copy={
        isHostedCheckout
          ? "You will continue to our secure payment partner."
          : "Payment is a demo until a secure checkout endpoint is configured."
      }
      onSubmit={onSubmit}
    >
      <div className="reviewDetails">
        <div>
          <span>Contact</span>
          <p>
            {contact.firstName} {contact.lastName}
            <br />
            {contact.email}
          </p>
          <button type="button" onClick={() => onEdit(1)}>
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
          <button type="button" onClick={() => onEdit(2)}>
            Edit
          </button>
        </div>
        <div>
          <span>Payment</span>
          <p>
            {isHostedCheckout ? "Hosted secure payment" : "Demo payment · No charge will be made"}
          </p>
        </div>
      </div>
      {error && (
        <p className="checkoutError" role="alert">
          {error}
        </p>
      )}
      <button className="button dark full" disabled={placing}>
        {placing
          ? "Placing order…"
          : `${isHostedCheckout ? "Continue to payment" : "Place demo order"} · ${money(total)}`}
      </button>
    </CheckoutSection>
  );
}
