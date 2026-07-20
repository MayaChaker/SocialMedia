import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./hooks/useStore";
import Layout from "./components/Layout";
import CartDrawer from "./features/cart/CartDrawer";
import HomePage from "./pages/HomePage";
import "./index.css";

const ShopPage = lazy(() => import("./features/products/ShopPage"));
const ProductPage = lazy(() => import("./features/products/ProductPage"));
const CheckoutPage = lazy(() => import("./features/checkout/CheckoutPage"));
const RitualsPage = lazy(() => import("./features/routine/RitualsPage"));
const ShadeMatchPage = lazy(() => import("./features/shade-match/ShadeMatchPage"));
const BeautyProfilePage = lazy(() => import("./features/beauty-profile/BeautyProfilePage"));
const WishlistPage = lazy(() => import("./features/wishlist/WishlistPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  return <StoreProvider><BrowserRouter><Suspense fallback={<div className="pageLoading" aria-live="polite">Preparing your ritual…</div>}><Routes><Route element={<Layout openCart={openCart}/>}><Route index element={<HomePage openCart={openCart}/>} /><Route path="shop" element={<ShopPage openCart={openCart}/>} /><Route path="shop/:category" element={<ShopPage openCart={openCart}/>} /><Route path="product/:slug" element={<ProductPage openCart={openCart}/>} /><Route path="wishlist" element={<WishlistPage openCart={openCart}/>} /><Route path="rituals" element={<RitualsPage openCart={openCart}/>} /><Route path="shade-match" element={<ShadeMatchPage/>} /><Route path="profile" element={<BeautyProfilePage/>} /><Route path="about" element={<AboutPage/>} /></Route><Route path="checkout" element={<CheckoutPage/>} /></Routes></Suspense><CartDrawer open={cartOpen} close={()=>setCartOpen(false)}/></BrowserRouter></StoreProvider>;
}

export default App;
