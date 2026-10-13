import { fireEvent, render, screen } from "@testing-library/react";
import AppProviders from "../../providers/AppProviders";
import { router, setLocation } from "../../test/navigation";
import ShopPage from "./ShopPage";

test("filters are read from the URL so filtered links can be shared", () => {
  setLocation("/shop/skincare?concern=Sensitive+skin&price=under-50");
  render(
    <AppProviders>
      <ShopPage category="skincare" />
    </AppProviders>,
  );
  // Essence ($48), cleanser ($42) and balm ($46) are sensitive-skin skincare under $50.
  expect(screen.getByText("3")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /sensitive skin/i })).toBeInTheDocument();

  // Removing a filter rewrites the URL in place instead of adding a history entry.
  fireEvent.click(screen.getByRole("button", { name: /under \$50/i }));
  expect(router.replace).toHaveBeenCalledWith("/shop/skincare?concern=Sensitive+skin", {
    scroll: false,
  });
});
