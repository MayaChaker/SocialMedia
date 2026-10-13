import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ChevronRight } from "@mui/icons-material";
import { FREE_SHIPPING_THRESHOLD } from "../../domain/commerce/commerceConfig";
import { money } from "../../lib/money";
import type { ShippingAddress, Totals } from "../../types/commerce";
import { bindField, CheckoutSection, Field } from "./CheckoutFields";

interface ShippingStepProps {
  shipping: ShippingAddress;
  setShipping: Dispatch<SetStateAction<ShippingAddress>>;
  totals: Totals;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export default function ShippingStep({
  shipping,
  setShipping,
  totals,
  onSubmit,
  onBack,
}: ShippingStepProps) {
  const bind = (key: keyof ShippingAddress) => bindField(setShipping, shipping, key);
  const copy =
    totals.shipping === 0
      ? "Your order qualifies for complimentary standard delivery."
      : `Standard delivery is ${money(totals.shipping)}; spend ${money(totals.freeShippingRemaining)} more for complimentary delivery over ${money(FREE_SHIPPING_THRESHOLD)}.`;

  return (
    <CheckoutSection title="Where should we send it?" copy={copy} onSubmit={onSubmit}>
      <div className="formGrid">
        <Field label="Address" autoComplete="address-line1" wide {...bind("address")} />
        <Field
          label="Apartment"
          autoComplete="address-line2"
          optional
          wide
          {...bind("apartment")}
        />
        <Field label="City" autoComplete="address-level2" {...bind("city")} />
        <Field label="Postal code" autoComplete="postal-code" optional {...bind("postalCode")} />
        <Field label="Country" autoComplete="country-name" wide {...bind("country")} />
      </div>
      <div className="stepActions">
        <button type="button" onClick={onBack}>
          Back
        </button>
        <button className="button dark">
          Review order <ChevronRight />
        </button>
      </div>
    </CheckoutSection>
  );
}
