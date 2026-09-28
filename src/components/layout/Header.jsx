import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AccountCircleOutlined, Close, FavoriteBorder, Menu, Search, ShoppingBagOutlined } from "@mui/icons-material";
import { useCommerce } from "../../hooks/useCommerce";
import GlobalSearch from "./GlobalSearch";

const navItems = [
  ["Shop", "/shop"],
  ["Routine builder", "/rituals"], ["Shade match", "/shade-match"], ["Our story", "/about"],
];

export default function Header({ openCart }) {
  const { cart, wishlist } = useCommerce();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const trigger = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    const focusable = () => navRef.current?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    requestAnimationFrame(() => focusable()?.[0]?.focus());
    const onKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [menuOpen]);

  return <><div className="announcement" role="region" aria-label="Store announcements"><span>Complimentary delivery on orders $75+</span><span className="announcementAlt">Build a routine · Find a suggested shade</span></div><header className="siteHeader"><button ref={menuButtonRef} className="mobileMenu" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} aria-controls="mainNav">{menuOpen?<Close/>:<Menu/>}</button><Link className="wordmark" to="/" aria-label="Veloura Beauty home">VELOURA<span>BEAUTY</span></Link><nav ref={navRef} id="mainNav" className={menuOpen?"open":""} aria-label="Main navigation">{navItems.map(([label,href])=><NavLink className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)} end={href==="/shop"||href==="/"} key={label} to={href}>{label}</NavLink>)}<div className="mobileNavExtras"><Link onClick={()=>setMenuOpen(false)} to="/profile"><AccountCircleOutlined/><span>Account</span></Link><Link onClick={()=>setMenuOpen(false)} to="/wishlist"><FavoriteBorder/><span>Wishlist{wishlist.length>0&&` (${wishlist.length})`}</span></Link></div></nav><div className="headerActions"><button onClick={()=>setSearchOpen(!searchOpen)} aria-label={searchOpen?"Close search":"Search"} aria-expanded={searchOpen}>{searchOpen?<Close/>:<Search/>}</button><Link className="secondaryHeaderAction" to="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><FavoriteBorder/>{wishlist.length>0&&<span>{wishlist.length}</span>}</Link><Link className="secondaryHeaderAction" to="/profile" aria-label="Beauty profile and account"><AccountCircleOutlined/></Link><button onClick={openCart} aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBagOutlined/>{cartCount>0&&<span>{cartCount}</span>}</button></div></header><button className={menuOpen?"menuBackdrop open":"menuBackdrop"} onClick={()=>setMenuOpen(false)} aria-label="Close navigation menu" tabIndex={menuOpen?0:-1}/><GlobalSearch open={searchOpen}/></>;
}
