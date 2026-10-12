import { createContext, useContext, useMemo } from "react";
import { addRecentlyViewedItem } from "../domain/customer/recentlyViewed";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";

const CustomerContext = createContext(null);
const defaultProfile = {
  skinGoals: ["Dehydration", "Dullness"],
  skinType: "Balanced",
  preferences: ["Natural coverage"],
};

export function CustomerProvider({ children }) {
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [routineResults, setRoutineResults] = usePersistentState(STORAGE_KEYS.routine, []);
  const [recentlyViewed, setRecentlyViewed] = usePersistentState(STORAGE_KEYS.recent, []);

  // Stable actions: safe to use as effect dependencies (see ProductPage).
  const actions = useMemo(
    () => ({
      saveProfile: (nextProfile) => setProfile(nextProfile),
      saveRoutine: (result) => setRoutineResults(result),
      addRecentlyViewed: (id) => setRecentlyViewed((items) => addRecentlyViewedItem(items, id)),
    }),
    [setProfile, setRecentlyViewed, setRoutineResults],
  );

  const value = useMemo(
    () => ({ profile, routineResults, recentlyViewed, ...actions }),
    [actions, profile, recentlyViewed, routineResults],
  );
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomer = () => {
  const value = useContext(CustomerContext);
  if (!value) throw new Error("useCustomer must be used inside CustomerProvider");
  return value;
};
