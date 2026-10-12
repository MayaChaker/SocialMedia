import { lazy, Suspense, useCallback, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppProviders from "./providers/AppProviders";
import Layout from "./components/layout/Layout";
import CartDrawer from "./features/cart/CartDrawer";

const ShopPage = lazy(() => import("./features/products/ShopPage"));
const ProductPage = lazy(() => import("./features/products/ProductPage"));
const CheckoutPage = lazy(() => import("./features/checkout/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./features/checkout/OrderConfirmationPage"));
const RitualsPage = lazy(() => import("./features/routine/RitualsPage"));
const ShadeMatchPage = lazy(() => import("./features/shade-match/ShadeMatchPage"));
const BeautyProfilePage = lazy(() => import("./features/beauty-profile/BeautyProfilePage"));
const WishlistPage = lazy(() => import("./features/wishlist/WishlistPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export function AppRoutes({ openCart }) {
  return (
    <Suspense
      fallback={
        <div className="pageLoading" aria-live="polite">
          Loading…
        </div>
      }
    >
      <Routes>
        <Route element={<Layout openCart={openCart} />}>
          <Route index element={<HomePage openCart={openCart} />} />
          <Route path="our-story" element={<Navigate to="/about" replace />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="shop" element={<ShopPage openCart={openCart} />} />
          <Route path="shop/:category" element={<ShopPage openCart={openCart} />} />
          <Route path="product/:slug" element={<ProductPage openCart={openCart} />} />
          <Route path="wishlist" element={<WishlistPage openCart={openCart} />} />
          <Route path="rituals" element={<RitualsPage openCart={openCart} />} />
          <Route path="shade-match" element={<ShadeMatchPage />} />
          <Route path="profile" element={<BeautyProfilePage />} />
          <Route path="care/:policy" element={<PolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/confirmation/:orderId" element={<OrderConfirmationPage />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes openCart={openCart} />
        <CartDrawer open={cartOpen} close={closeCart} />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
