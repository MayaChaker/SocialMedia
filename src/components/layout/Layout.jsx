import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MOTION } from "../../theme/tokens";
import Footer from "./Footer";
import Header from "./Header";
import { syncRouteMetadata } from "./routeMetadata";

export default function Layout({ openCart }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  useEffect(() => {
    syncRouteMetadata(location.pathname);
  }, [location.pathname]);

  return <div className="siteShell"><a className="skipLink" href="#mainContent">Skip to content</a><Header openCart={openCart}/><div id="mainContent"><AnimatePresence mode="wait"><motion.div key={location.pathname+location.search} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={MOTION.page}><Outlet/></motion.div></AnimatePresence></div><Footer/></div>;
}
