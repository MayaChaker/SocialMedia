"use client";

import HomePage from "../pages/HomePage";
import { NextLink } from "./navigation";
import { useCartShell } from "./shell";

export default function HomePageClient() {
  const { openCart } = useCartShell();
  return <HomePage openCart={openCart} LinkComponent={NextLink}/>;
}
