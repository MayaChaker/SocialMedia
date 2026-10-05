"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NextLink({ to, ...props }) {
  return <Link href={to} {...props}/>;
}

export function NextNavLink({ to, end, className, ...props }) {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;
  return <Link href={to} className={resolvedClassName} {...props}/>;
}
