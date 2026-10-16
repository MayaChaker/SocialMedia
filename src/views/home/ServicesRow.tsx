import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "../../domain/commerce/commerceConfig";
import styles from "./ServicesRow.module.css";

const SERVICES = [
  {
    title: "Complimentary delivery",
    copy: `On every order over $${FREE_SHIPPING_THRESHOLD}`,
    href: "/care/shipping",
  },
  {
    title: "Shade Match",
    copy: "A few questions, a suggested foundation shade",
    href: "/shade-match",
  },
  {
    title: "Routine Builder",
    copy: "A skincare routine for your skin and goals",
    href: "/rituals",
  },
];

/** What Veloura does besides selling: right under the hero, one line each. */
export default function ServicesRow() {
  return (
    <ul className={styles.services}>
      {SERVICES.map((service) => (
        <li key={service.title}>
          <Link href={service.href}>
            <span>
              <strong>{service.title}</strong>
              <span>{service.copy}</span>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
