"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

/** The header search: always visible, submits to the results listing. */
interface SearchBarProps {
  id?: string;
  /** Called after a search is submitted, e.g. to close the mobile menu. */
  onSearch?: () => void;
}

export default function SearchBar({ id = "siteSearch", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    setQuery("");
    onSearch?.();
  };

  return (
    <form className={styles.search} role="search" onSubmit={submit}>
      <label className="srOnly" htmlFor={id}>
        Search products and brands
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products and brands"
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" aria-label="Search">
        <Search aria-hidden="true" />
      </button>
    </form>
  );
}
