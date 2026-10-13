"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import { productRepository } from "../../repositories/productRepository";

const productSuggestions = productRepository.getAll();

interface GlobalSearchProps {
  open: boolean;
  /** Called after a search is submitted, e.g. to close the panel. */
  onSearch?: () => void;
}

export default function GlobalSearch({ open, onSearch }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      onSearch?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.form
          className="searchBar"
          role="search"
          onSubmit={submit}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <Search aria-hidden="true" />
          <label className="srOnly" htmlFor="siteSearch">
            Search by product, category, benefit, or shade
          </label>
          <input
            id="siteSearch"
            type="search"
            list="productSuggestions"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, benefits, or shades…"
          />
          <datalist id="productSuggestions">
            {productSuggestions.map((product) => (
              <option value={product.name} key={product.id} />
            ))}
          </datalist>
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              Clear
            </button>
          )}
          <button type="submit" disabled={!query.trim()}>
            Search
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
