"use client";

import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Field";
import styles from "./Newsletter.module.css";

/** Newsletter sign-up. Demo only: nothing is sent or stored, and the message says so. */
export default function Newsletter() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.newsletter}>
      <h2 className="text-h4">New in, first</h2>
      <p className="text-small text-muted">Launches and new brands, once a month.</p>
      {sent ? (
        <p className="text-small" role="status">
          Thank you. This is a demo store, so no email was saved.
        </p>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <Input
            label="Email address"
            hideLabel
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
          <Button type="submit">Sign up</Button>
        </form>
      )}
    </div>
  );
}
