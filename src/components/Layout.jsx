import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AccountCircleOutlined, Close, FavoriteBorder, Menu, Search, ShoppingBagOutlined } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { MOTION } from "../theme/tokens";
import { PRODUCTS } from "../data/products";

const navItems = [
  ["Shop", "/shop"],
  ["Routine builder", "/rituals"], ["Shade match", "/shade-match"], ["Our story", "/about"],
];

export default function Layout({ openCart }) {
  const { cart, wishlist, addSearch } = useStore();
  const [menuOpen,setMenuOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const navRef=useRef(null);
  const menuButtonRef=useRef(null);
  const navigate=useNavigate();
  const location=useLocation();
  const storyActive=["/about","/our-story"].includes(location.pathname);
  const cartCount=cart.reduce((count,item)=>count+item.quantity,0);

  useEffect(()=>{setMenuOpen(false);setSearchOpen(false);window.scrollTo({top:0,behavior:"auto"})},[location.pathname,location.search]);
  useEffect(()=>{if(!menuOpen)return undefined;const previousOverflow=document.body.style.overflow;const trigger=menuButtonRef.current;document.body.style.overflow="hidden";const focusable=()=>navRef.current?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');requestAnimationFrame(()=>focusable()?.[0]?.focus());const onKey=(event)=>{if(event.key==="Escape"){setMenuOpen(false);return}if(event.key!=="Tab")return;const nodes=focusable();if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}};document.addEventListener("keydown",onKey);return()=>{document.body.style.overflow=previousOverflow;document.removeEventListener("keydown",onKey);trigger?.focus()}},[menuOpen]);
  useEffect(()=>{const section=location.pathname.split("/").filter(Boolean)[0];const titles={shop:"Shop",product:"Product",wishlist:"Wishlist",rituals:"Routine Builder","shade-match":"Shade Match",profile:"Beauty Profile",about:"Our Story",care:"Customer Care"};document.title=section?`${titles[section]||"Beauty"} | Veloura Beauty`:"Veloura Beauty — Beauty, considered.";const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute("content",section==="shop"?"Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty.":"High-performance beauty essentials made for daily ritual.")},[location.pathname]);

  useEffect(()=>{if(location.pathname==="/our-story")document.title="Our Story | Veloura Beauty"},[location.pathname]);

  const submit=(event)=>{event.preventDefault();if(query.trim()){addSearch(query);navigate(`/shop?search=${encodeURIComponent(query.trim())}`);setQuery("")}};
  return <div className="siteShell"><a className="skipLink" href="#mainContent">Skip to content</a>
    <div className="announcement" role="region" aria-label="Store announcements"><span>Complimentary delivery on orders $75+</span><span className="announcementAlt">Build a routine · Find a suggested shade</span></div>
    <header className="siteHeader"><button ref={menuButtonRef} className="mobileMenu" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} aria-controls="mainNav">{menuOpen?<Close/>:<Menu/>}</button><Link className="wordmark" to="/" aria-label="Veloura Beauty home">VELOURA<span>BEAUTY</span></Link><nav ref={navRef} id="mainNav" className={menuOpen?"open":""} aria-label="Main navigation">{navItems.map(([label,href])=><NavLink className={({isActive})=>isActive||(label==="Our story"&&storyActive)?"active":undefined} onClick={()=>setMenuOpen(false)} end={href==="/shop"||href==="/"} key={label} to={href}>{label}</NavLink>)}<div className="mobileNavExtras"><Link onClick={()=>setMenuOpen(false)} to="/profile"><AccountCircleOutlined/><span>Account</span></Link><Link onClick={()=>setMenuOpen(false)} to="/wishlist"><FavoriteBorder/><span>Wishlist{wishlist.length>0&&` (${wishlist.length})`}</span></Link></div></nav><div className="headerActions"><button onClick={()=>setSearchOpen(!searchOpen)} aria-label={searchOpen?"Close search":"Search"} aria-expanded={searchOpen}>{searchOpen?<Close/>:<Search/>}</button><Link className="secondaryHeaderAction" to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><FavoriteBorder/>{wishlist.length>0&&<span>{wishlist.length}</span>}</Link><Link className="secondaryHeaderAction" to="/profile" aria-label="Beauty profile and account"><AccountCircleOutlined/></Link><button onClick={openCart} aria-label={`Shopping bag with ${cartCount} items` }><ShoppingBagOutlined/>{cartCount>0&&<span>{cartCount}</span>}</button></div></header>
    <button className={menuOpen?"menuBackdrop open":"menuBackdrop"} onClick={()=>setMenuOpen(false)} aria-label="Close navigation menu" tabIndex={menuOpen?0:-1}/>
    <AnimatePresence>{searchOpen&&<motion.form className="searchBar" role="search" onSubmit={submit} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Search aria-hidden="true"/><label className="srOnly" htmlFor="siteSearch">Search by product, category, benefit, or shade</label><input id="siteSearch" type="search" list="productSuggestions" autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search products, benefits, or shades…"/><datalist id="productSuggestions">{PRODUCTS.map((product)=><option value={product.name} key={product.id}/>)}</datalist>{query&&<button type="button" onClick={()=>setQuery("")} aria-label="Clear search">Clear</button>}<button type="submit" disabled={!query.trim()}>Search</button></motion.form>}</AnimatePresence>
    <div id="mainContent"><AnimatePresence mode="wait"><motion.div key={location.pathname+location.search} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={MOTION.page}><Outlet/></motion.div></AnimatePresence></div><Footer/></div>;
}

function Footer(){const contact=process.env.REACT_APP_CONTACT_EMAIL||"care@velourabeauty.com";return <footer className="siteFooter"><div className="footerInner"><div className="footerGrid"><div className="footerBrand"><Link className="wordmark" to="/">VELOURA<span>BEAUTY</span></Link><p>Skincare, colour, and sets for considered everyday routines.</p></div><div className="footerColumn"><h4>Shop</h4><Link to="/shop">All products</Link><Link to="/shop/skincare">Skincare</Link><Link to="/shop/makeup">Makeup</Link><Link to="/shop/sets">Sets</Link><Link to="/shop?collection=new">New arrivals</Link></div><div className="footerColumn"><h4>Customer care</h4><a href={`mailto:${contact}`}>Contact</a><Link to="/care/faq">FAQ</Link><Link to="/care/shipping">Shipping & returns</Link><Link to="/care/refund">Refund policy</Link><Link to="/care/track">Track order</Link></div><div className="footerColumn"><h4>About Veloura</h4><Link to="/about">Our story</Link><Link to="/rituals">Routine builder</Link><Link to="/shade-match">Shade match</Link><Link to="/care/accessibility">Accessibility</Link></div></div><div className="footerBottom"><span>© {new Date().getFullYear()} Veloura Beauty</span><div className="footerLegal"><Link to="/care/privacy">Privacy</Link><Link to="/care/terms">Terms</Link></div>{process.env.REACT_APP_CHECKOUT_URL&&<span className="checkoutProviderNote">Payment methods shown by the secure checkout provider</span>}</div></div></footer>}
