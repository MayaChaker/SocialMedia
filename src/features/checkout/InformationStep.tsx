import type { Dispatch, FormEvent, SetStateAction } from "react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import type { ContactDetails } from "../../types/commerce";
import { bindField } from "./checkoutForm";
import styles from "./checkout.module.css";

interface InformationStepProps {
  contact: ContactDetails;
  setContact: Dispatch<SetStateAction<ContactDetails>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function InformationStep({ contact, setContact, onSubmit }: InformationStepProps) {
  const bind = (key: keyof ContactDetails) => bindField(setContact, contact, key);
  return (
    <form onSubmit={onSubmit}>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Your information</h2>
        <p className={styles.cardNote}>For your order updates, and for the courier to reach you.</p>
        <div className={styles.fields}>
          <div className={styles.wide}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              {...bind("email")}
            />
          </div>
          <Input
            label="First name"
            autoComplete="given-name"
            placeholder="e.g. Layla"
            required
            {...bind("firstName")}
          />
          <Input
            label="Last name"
            autoComplete="family-name"
            placeholder="e.g. Haddad"
            required
            {...bind("lastName")}
          />
          <Input
            label="Phone"
            type="tel"
            autoComplete="tel"
            placeholder="+961 3 123 456"
            hint="The courier calls this number on the day of delivery."
            required
            {...bind("phone")}
          />
        </div>
      </section>
      <div className={styles.actions}>
        <span />
        <Button type="submit">Continue to delivery</Button>
      </div>
    </form>
  );
}
