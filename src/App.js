import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppProviders from "./providers/AppProviders";
import Layout from "./components/layout/Layout";
import CartDrawer from "./features/cart/CartDrawer";
import "./index.css";

const ShopPage = lazy(() => import("./features/products/ShopPage"));
const ProductPage = lazy(() => import("./features/products/ProductPage"));
const CheckoutPage = lazy(() => import("./features/checkout/CheckoutPage"));
const RitualsPage = lazy(() => import("./features/routine/RitualsPage"));
const ShadeMatchPage = lazy(() => import("./features/shade-match/ShadeMatchPage"));
const BeautyProfilePage = lazy(() => import("./features/beauty-profile/BeautyProfilePage"));
const WishlistPage = lazy(() => import("./features/wishlist/WishlistPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  return <AppProviders><BrowserRouter><Suspense fallback={<div className="pageLoading" aria-live="polite">Preparing your routine…</div>}><Routes><Route element={<Layout openCart={openCart}/>}><Route index element={<HomePage openCart={openCart}/>}/><Route path="our-story" element={<Navigate to="/about" replace/>}/><Route path="about" element={<AboutPage/>}/><Route path="shop" element={<ShopPage openCart={openCart}/>}/><Route path="shop/:category" element={<ShopPage openCart={openCart}/>}/><Route path="product/:slug" element={<ProductPage openCart={openCart}/>}/><Route path="wishlist" element={<WishlistPage openCart={openCart}/>}/><Route path="rituals" element={<RitualsPage openCart={openCart}/>}/><Route path="shade-match" element={<ShadeMatchPage/>}/><Route path="profile" element={<BeautyProfilePage/>}/><Route path="care/:policy" element={<PolicyPage/>}/></Route><Route path="checkout" element={<CheckoutPage/>}/></Routes></Suspense><CartDrawer open={cartOpen} close={()=>setCartOpen(false)}/></BrowserRouter></AppProviders>;
}

export default App;
