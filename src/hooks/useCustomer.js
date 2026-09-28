import { createContext, useContext, useMemo } from "react";
import { addRecentlyViewedItem } from "../domain/customer/recentlyViewed";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import { usePersistentState } from "./usePersistentState";

const CustomerContext = createContext(null);
const defaultProfile = { skinGoals: ["Dehydration", "Dullness"], skinType: "Balanced", preferences: ["Natural coverage", "Sensitive skin"] };

export function CustomerProvider({ children }) {
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [routineResults, setRoutineResults] = usePersistentState(STORAGE_KEYS.routine, []);
  const [recentlyViewed, setRecentlyViewed] = usePersistentState(STORAGE_KEYS.recent, []);
  const value = useMemo(() => ({
    profile,
    routineResults,
    recentlyViewed,
    saveProfile(nextProfile) { setProfile(nextProfile); },
    saveRoutine(result) { setRoutineResults(result); },
    addRecentlyViewed(id) { setRecentlyViewed((items) => addRecentlyViewedItem(items, id)); },
  }), [profile, recentlyViewed, routineResults, setProfile, setRecentlyViewed, setRoutineResults]);
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomer = () => {
  const value = useContext(CustomerContext);
  if (!value) throw new Error("useCustomer must be used inside CustomerProvider");
  return value;
};
