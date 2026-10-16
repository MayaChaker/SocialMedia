"use client";

import { useState, type FormEvent } from "react";
import styles from "./Newsletter.module.css";

/** Newsletter sign-up. No mailing service is connected yet, and the confirmation says so. */
export default function Newsletter() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <div className={styles.newsletter}>
      <p className="text-label text-muted">Letters from Veloura</p>
      <h2 className={styles.title}>New houses and launches, first.</h2>
      {sent ? (
        <p className="text-small" role="status">
          Thank you. Newsletter sign-up opens soon.
        </p>
      ) : (
        <form className={styles.form} onSubmit={submit}>
          <label className="srOnly" htmlFor="newsletterEmail">
            Email address
          </label>
          <input
            id="newsletterEmail"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      )}
    </div>
  );
}
