import { createContext, useContext } from "react";

const AppContext = createContext(null);

function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  const contextValue = useContext(AppContext);
  if (contextValue) return contextValue;
  return {
    searchTerm: "",
    setSearchTerm: undefined,
    filter: "All",
    setFilter: undefined,
    sort: "Newest",
    setSort: undefined,
    savedCount: 0,
    inboxUnreadCount: 0,
    currentUserName: "You",
    setCurrentUserName: () => {},
    defaultCountry: "Lebanon",
    setDefaultCountry: () => {},
    defaultCity: "Beirut",
    setDefaultCity: () => {},
    userBio: "",
    setUserBio: () => {},
    theme: "dark",
    setTheme: () => {},
    onClearSavedTasks: () => {},
    onClearInbox: () => {},
    addTask: undefined,
  };
}

export { AppProvider, useAppContext };
