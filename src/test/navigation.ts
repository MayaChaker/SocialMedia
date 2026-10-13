// In-memory stand-in for `next/navigation`, installed for every test in jest.setup.js.
// Tests set the current URL with `setLocation` and assert on `router` calls.
const location: { pathname: string; search: string; params: Record<string, string> } = {
  pathname: "/",
  search: "",
  params: {},
};

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

export function setLocation(url: string, params: Record<string, string> = {}) {
  const [pathname = "/", search = ""] = url.split("?");
  location.pathname = pathname;
  location.search = search;
  location.params = params;
}

export function resetNavigation() {
  setLocation("/");
  Object.values(router).forEach((fn) => fn.mockReset());
}

export const navigationMock = {
  useRouter: () => router,
  usePathname: () => location.pathname,
  useSearchParams: () => new URLSearchParams(location.search),
  useParams: () => location.params,
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  },
};
