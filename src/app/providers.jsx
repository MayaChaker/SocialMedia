"use client";

import { useEffect, useState } from "react";
import AppProviders from "../providers/AppProviders";

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <AppProviders>{children}</AppProviders>;
}
