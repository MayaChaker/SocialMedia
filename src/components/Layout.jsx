import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AccountCircleOutlined, Close, FavoriteBorder, Menu, Search, ShoppingBagOutlined } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { MOTION } from "../theme/tokens";

const navItems = [
  ["Shop", "/shop"], ["Skincare", "/shop/skincare"], ["Makeup", "/shop/makeup"], ["Sets", "/shop/sets"],
  ["New arrivals", "/shop?collection=new"], ["Routine builder", "/rituals"], ["Shade match", "/shade-match"], ["Our story", "/about"],
];

export default function Layout({ openCart }) {
  const { cart, wishlist, addSearch } = useStore();
  const [menuOpen,setMenuOpen]=useState(false);
  const [searchOpen,setSearchOpen]=useState(false);
  const [query,setQuery]=useState("");
  const navigate=useNavigate();
  const location=useLocation();
  const spotlight=useRef(null);
  const cartCount=cart.reduce((count,item)=>count+item.quantity,0);

  useEffect(()=>{setMenuOpen(false);setSearchOpen(false);window.scrollTo({top:0,behavior:"auto"})},[location.pathname,location.search]);
  useEffect(()=>{const section=location.pathname.split("/").filter(Boolean)[0];const titles={shop:"Shop",product:"Product",wishlist:"Wishlist",rituals:"Routine Builder","shade-match":"Shade Match",profile:"Beauty Profile",about:"Our Story",care:"Customer Care"};document.title=section?`${titles[section]||"Beauty"} | Veloura Beauty`:"Veloura Beauty — Beauty, considered.";const description=document.querySelector('meta[name="description"]');if(description)description.setAttribute("content",section==="shop"?"Shop considered skincare, makeup, and curated beauty rituals from Veloura Beauty.":"High-performance beauty essentials made for daily ritual.")},[location.pathname]);
  useEffect(()=>{const fine=window.matchMedia("(hover: hover) and (pointer: fine)").matches;if(!fine)return;const move=(event)=>{if(spotlight.current)spotlight.current.style.transform=`translate3d(${event.clientX-160}px,${event.clientY-160}px,0)`};window.addEventListener("pointermove",move,{passive:true});return()=>window.removeEventListener("pointermove",move)},[]);

  const submit=(event)=>{event.preventDefault();if(query.trim()){addSearch(query);navigate(`/shop?search=${encodeURIComponent(query.trim())}`);setQuery("")}};
  return <div className="siteShell"><a className="skipLink" href="#mainContent">Skip to content</a><div className="cursorSpotlight" ref={spotlight}/>
    <div className="announcement" role="region" aria-label="Store announcements"><span>Complimentary delivery on orders over $75</span><span className="announcementAlt">Cruelty-free beauty · Easy 30-day returns</span></div>
    <header className="siteHeader"><button className="mobileMenu" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} aria-controls="mainNav">{menuOpen?<Close/>:<Menu/>}</button><Link className="wordmark" to="/" aria-label="Veloura Beauty home">VELOURA<span>BEAUTY</span></Link><nav id="mainNav" className={menuOpen?"open":""} aria-label="Main navigation">{navItems.map(([label,href])=><NavLink end={href==="/shop"} key={label} to={href}>{label}</NavLink>)}</nav><div className="headerActions"><button onClick={()=>setSearchOpen(!searchOpen)} aria-label={searchOpen?"Close search":"Search"} aria-expanded={searchOpen}>{searchOpen?<Close/>:<Search/>}</button><Link to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><FavoriteBorder/>{wishlist.length>0&&<span>{wishlist.length}</span>}</Link><Link to="/profile" aria-label="Beauty profile and account"><AccountCircleOutlined/></Link><button onClick={openCart} aria-label={`Shopping bag with ${cartCount} items` }><ShoppingBagOutlined/>{cartCount>0&&<span>{cartCount}</span>}</button></div></header>
    <AnimatePresence>{searchOpen&&<motion.form className="searchBar" onSubmit={submit} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><Search/><label className="srOnly" htmlFor="siteSearch">Search products</label><input id="siteSearch" autoFocus value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search formulas, shades, rituals…"/><button>Search</button></motion.form>}</AnimatePresence>
    <div id="mainContent"><AnimatePresence mode="wait"><motion.div key={location.pathname+location.search} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={MOTION.page}><Outlet/></motion.div></AnimatePresence></div><Footer/></div>;
}

function Footer(){const contact=process.env.REACT_APP_CONTACT_EMAIL||"care@velourabeauty.com";return <footer className="siteFooter"><div className="footerBrand"><Link className="wordmark" to="/">VELOURA<span>BEAUTY</span></Link><p>Considered beauty for everyday ritual.</p><div className="footerSocial"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TikTok</a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest</a></div></div><div><h4>Shop</h4><Link to="/shop">All products</Link><Link to="/shop/skincare">Skincare</Link><Link to="/shop/makeup">Makeup</Link><Link to="/shop/sets">Sets</Link><Link to="/shop?collection=new">New arrivals</Link></div><div><h4>Customer care</h4><a href={`mailto:${contact}`}>Contact</a><Link to="/care/faq">FAQ</Link><Link to="/care/shipping">Shipping & returns</Link><Link to="/care/refund">Refund policy</Link><Link to="/care/track">Track order</Link></div><div><h4>About Veloura</h4><Link to="/about">Our story</Link><Link to="/rituals">Routine builder</Link><Link to="/shade-match">Shade match</Link><Link to="/care/accessibility">Accessibility</Link></div><div className="footerBottom"><span>© {new Date().getFullYear()} Veloura Beauty</span><div className="footerLegal"><Link to="/care/privacy">Privacy</Link><Link to="/care/terms">Terms</Link></div><div className="paymentMarks" aria-label="Accepted payment methods"><span>VISA</span><span>Mastercard</span><span>AMEX</span><span>Apple Pay</span></div></div></footer>}
