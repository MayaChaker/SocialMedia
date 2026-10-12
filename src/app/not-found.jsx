import StoreShell from "../components/layout/StoreShell";
import NotFoundPage from "../views/NotFoundPage";

export const metadata = { title: "Page not found" };

// Unmatched URLs only get the root layout, so add the store chrome here.
export default function NotFound() {
  return (
    <StoreShell>
      <NotFoundPage />
    </StoreShell>
  );
}
