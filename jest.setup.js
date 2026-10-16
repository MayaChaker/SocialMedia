import "@testing-library/jest-dom";
import { resetNavigation } from "./src/test/navigation";

jest.mock("next/navigation", () => require("./src/test/navigation").navigationMock);
jest.mock("leaflet", () => require("./src/test/leaflet").leafletMock);

beforeEach(() => {
  window.localStorage.clear();
  resetNavigation();
});
