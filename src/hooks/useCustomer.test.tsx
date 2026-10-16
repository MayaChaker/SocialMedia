import { fireEvent, render, screen } from "@testing-library/react";
import { CustomerProvider, useCustomer } from "./useCustomer";

function CustomerActions() {
  const { saveProfile, addRecentlyViewed } = useCustomer();
  return (
    <>
      <button onClick={() => saveProfile({ skinType: "Dry", skinGoals: [], preferences: [] })}>
        Save profile
      </button>
      <button onClick={() => addRecentlyViewed(7)}>View product</button>
    </>
  );
}

const stored = (key: string): unknown => JSON.parse(window.localStorage.getItem(key) ?? "null");

beforeEach(() => window.localStorage.clear());

test("profile and recently viewed actions keep their persisted shapes and keys", () => {
  render(
    <CustomerProvider>
      <CustomerActions />
    </CustomerProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
  fireEvent.click(screen.getByRole("button", { name: "View product" }));
  expect(stored("velouraBeauty.beautyProfile.v1")).toEqual({
    skinType: "Dry",
    skinGoals: [],
    preferences: [],
  });
  expect(stored("velouraBeauty.recentlyViewed.v1")).toEqual([7]);
});
