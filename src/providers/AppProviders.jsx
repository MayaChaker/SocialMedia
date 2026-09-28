import { CommerceProvider } from "../hooks/useCommerce";
import { CustomerProvider } from "../hooks/useCustomer";

export default function AppProviders({ children }) {
  return <CommerceProvider><CustomerProvider>{children}</CustomerProvider></CommerceProvider>;
}
