import { fireEvent, render, screen } from "@testing-library/react";
import { CustomerProvider, useCustomer } from "./useCustomer";

function CustomerActions() {
  const { saveProfile, saveRoutine } = useCustomer();
  return <>
    <button onClick={() => saveProfile({ skinType: "Dry", skinGoals: [], preferences: [] })}>Save profile</button>
    <button onClick={() => saveRoutine({ productIds: [2, 3], answers: { goal: "Dullness" } })}>Save routine</button>
  </>;
}

beforeEach(() => window.localStorage.clear());

test("profile and routine actions preserve persisted value shapes and keys", () => {
  render(<CustomerProvider><CustomerActions/></CustomerProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
  fireEvent.click(screen.getByRole("button", { name: "Save routine" }));
  expect(JSON.parse(window.localStorage.getItem("velouraBeauty.beautyProfile.v1"))).toEqual({ skinType: "Dry", skinGoals: [], preferences: [] });
  expect(JSON.parse(window.localStorage.getItem("velouraBeauty.routineResults.v1"))).toEqual({ productIds: [2, 3], answers: { goal: "Dullness" } });
});
