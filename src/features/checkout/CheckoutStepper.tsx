import { Check } from "@mui/icons-material";
import styles from "./checkout.module.css";

export const CHECKOUT_STEPS = ["Information", "Delivery", "Payment"] as const;

/** Where the shopper is: finished steps are ticked, the current one is outlined. */
export default function CheckoutStepper({ step }: { step: number }) {
  return (
    <ol className={styles.stepper} aria-label="Checkout progress">
      {CHECKOUT_STEPS.map((label, index) => {
        const number = index + 1;
        const state = number < step ? "done" : number === step ? "current" : "next";
        return (
          <li
            key={label}
            className={styles.step}
            data-state={state}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className={styles.stepDot}>
              {state === "done" ? <Check aria-hidden="true" /> : number}
            </span>
            {label}
            {state === "done" && <span className="srOnly"> (completed)</span>}
          </li>
        );
      })}
    </ol>
  );
}
