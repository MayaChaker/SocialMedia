"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockOutlined } from "@mui/icons-material";
import styles from "./checkout.module.css";

/** A quiet header for checkout and confirmation: no menu, nothing to pull the shopper away. */
export default function CheckoutHeader({ back = true }: { back?: boolean }) {
  const router = useRouter();
  return (
    <header className={styles.top}>
      {back ? (
        <button type="button" className={styles.backTop} onClick={() => router.back()}>
          ← Back
        </button>
      ) : (
        <span />
      )}
      <Link href="/" className={styles.logo} aria-label="Veloura, home">
        VELOURA
      </Link>
      <span className={styles.secure}>
        <LockOutlined aria-hidden="true" />
        <span>Secure checkout</span>
      </span>
    </header>
  );
}
