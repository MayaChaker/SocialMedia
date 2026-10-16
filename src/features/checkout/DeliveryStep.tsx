import type { Dispatch, FormEvent, SetStateAction } from "react";
import { FREE_SHIPPING_THRESHOLD } from "../../domain/commerce/commerceConfig";
import { money } from "../../lib/money";
import Button from "../../components/ui/Button";
import { Input, TextArea } from "../../components/ui/Field";
import type { ShippingAddress, Totals } from "../../types/commerce";
import { bindField } from "./checkoutForm";
import LocationPicker, { type PickedLocation } from "./LocationPicker";
import styles from "./checkout.module.css";

interface DeliveryStepProps {
  shipping: ShippingAddress;
  setShipping: Dispatch<SetStateAction<ShippingAddress>>;
  totals: Totals;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

export default function DeliveryStep({
  shipping,
  setShipping,
  totals,
  onSubmit,
  onBack,
}: DeliveryStepProps) {
  const bind = (key: "area" | "street" | "building" | "floor" | "directions") =>
    bindField(setShipping, shipping, key);

  // A new pin fills the street and area from the map; the shopper can still edit them.
  const pick = ({ lat, lng, street, area }: PickedLocation) =>
    setShipping((current) => ({
      ...current,
      location: { lat, lng },
      street: street ?? current.street,
      area: area ?? current.area,
    }));

  return (
    <form onSubmit={onSubmit}>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Delivery location</h2>
        <p className={styles.cardNote}>
          Drop the pin on your building so the courier finds you easily.
        </p>
        <LocationPicker value={shipping.location} onPick={pick} />
        <div className={styles.fields}>
          <Input
            label="City / area"
            autoComplete="address-level2"
            placeholder="e.g. Beirut, Gemmayzeh"
            required
            {...bind("area")}
          />
          <Input
            label="Street"
            autoComplete="address-line1"
            placeholder="e.g. Rue Gouraud"
            required
            {...bind("street")}
          />
          <Input
            label="Building"
            placeholder="e.g. Building 14 or building name"
            required
            {...bind("building")}
          />
          <Input
            label="Floor and apartment"
            placeholder="e.g. 3rd floor, apt. 5"
            {...bind("floor")}
          />
          <div className={styles.wide}>
            <TextArea
              label="Directions for the courier (optional)"
              placeholder="e.g. Next to the pharmacy, blue door"
              rows={3}
              {...bind("directions")}
            />
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Delivery method</h2>
        <p className={styles.cardNote}>
          Complimentary on orders over {money(FREE_SHIPPING_THRESHOLD)}.
        </p>
        <label className={`${styles.option} ${styles.optionChosen}`}>
          <input type="radio" name="delivery" defaultChecked />
          <span>
            Standard delivery
            <small>3–5 business days after dispatch</small>
          </span>
          <strong>{totals.shipping ? money(totals.shipping) : "Free"}</strong>
        </label>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.back} onClick={onBack}>
          ← Back to information
        </button>
        <Button type="submit">Continue to payment</Button>
      </div>
    </form>
  );
}
