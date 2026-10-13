import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ChevronRight } from "@mui/icons-material";
import type { ContactDetails } from "../../types/commerce";
import { bindField, CheckoutSection, Field } from "./CheckoutFields";

interface ContactStepProps {
  contact: ContactDetails;
  setContact: Dispatch<SetStateAction<ContactDetails>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ContactStep({ contact, setContact, onSubmit }: ContactStepProps) {
  const bind = (key: keyof ContactDetails) => bindField(setContact, contact, key);
  return (
    <CheckoutSection
      title="Your details"
      copy="We’ll use these details only for your order updates."
      onSubmit={onSubmit}
    >
      <div className="formGrid">
        <Field label="Email" type="email" autoComplete="email" wide {...bind("email")} />
        <Field label="First name" autoComplete="given-name" {...bind("firstName")} />
        <Field label="Last name" autoComplete="family-name" {...bind("lastName")} />
        <Field label="Phone" type="tel" autoComplete="tel" optional wide {...bind("phone")} />
      </div>
      <button className="button dark checkoutNext">
        Continue to shipping <ChevronRight />
      </button>
    </CheckoutSection>
  );
}
