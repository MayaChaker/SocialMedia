import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "@mui/icons-material";
import { productRepository } from "../../repositories/productRepository";

const productSuggestions = productRepository.getAll();

export default function GlobalSearch({ open }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return <AnimatePresence>{open&&<motion.form className="searchBar" role="search" onSubmit={submit} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Search aria-hidden="true"/><label className="srOnly" htmlFor="siteSearch">Search by product, category, benefit, or shade</label><input id="siteSearch" type="search" list="productSuggestions" autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search products, benefits, or shades…"/><datalist id="productSuggestions">{productSuggestions.map((product)=><option value={product.name} key={product.id}/>)}</datalist>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search">Clear</button>}<button type="submit" disabled={!query.trim()}>Search</button></motion.form>}</AnimatePresence>;
}
