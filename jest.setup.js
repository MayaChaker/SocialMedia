import "@testing-library/jest-dom";
import { resetNavigation } from "./src/test/navigation";

jest.mock("next/navigation", () => require("./src/test/navigation").navigationMock);

beforeEach(() => {
  window.localStorage.clear();
  resetNavigation();
});
