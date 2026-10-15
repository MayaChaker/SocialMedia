import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "text";

interface CommonProps {
  variant?: Variant;
  /** Stretch to the width of the parent, e.g. "Add to bag" on the product page. */
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const buttonClass = (variant: Variant = "primary", fullWidth = false, extra?: string) =>
  [styles.button, styles[variant], fullWidth && styles.full, extra].filter(Boolean).join(" ");

/** The only button of the site: a <button>, or a link styled as one when `href` is given. */
export default function Button(props: ButtonProps | LinkProps) {
  if (props.href !== undefined) {
    const { variant, fullWidth, className, children, href, ...rest } = props;
    return (
      <Link href={href} className={buttonClass(variant, fullWidth, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, fullWidth, className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClass(variant, fullWidth, className)} {...rest}>
      {children}
    </button>
  );
}
