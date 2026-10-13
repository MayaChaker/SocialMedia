import type {
  ChangeEvent,
  Dispatch,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";

/** Wires an input to one string field of a form state object. */
export function bindField<K extends string, T extends Record<K, string>>(
  setter: Dispatch<SetStateAction<T>>,
  values: T,
  key: K,
) {
  return {
    name: key,
    value: values[key],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setter((current) => ({ ...current, [key]: event.target.value })),
  };
}

interface CheckoutSectionProps {
  title: string;
  copy: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}

/** Each step is a real <form>, so the browser validates required fields and email format. */
export function CheckoutSection({ title, copy, onSubmit, children }: CheckoutSectionProps) {
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

export function Field({ label, wide, optional = false, ...props }: FieldProps) {
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
