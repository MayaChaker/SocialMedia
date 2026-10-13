import { createContext, useContext, useMemo, type ReactNode } from "react";
import { addRecentlyViewedItem } from "../domain/customer/recentlyViewed";
import { STORAGE_KEYS } from "../repositories/storageRepository";
import type { ProductId } from "../types/commerce";
import type { BeautyProfile, SavedRoutine, StoredRoutine } from "../types/customer";
import { usePersistentState } from "./usePersistentState";

export interface CustomerActions {
  saveProfile: (nextProfile: BeautyProfile) => void;
  saveRoutine: (result: SavedRoutine) => void;
  addRecentlyViewed: (id: ProductId) => void;
}

export interface CustomerState extends CustomerActions {
  profile: BeautyProfile;
  routineResults: StoredRoutine;
  recentlyViewed: ProductId[];
}

const CustomerContext = createContext<CustomerState | null>(null);
const defaultProfile: BeautyProfile = {
  skinGoals: ["Dehydration", "Dullness"],
  skinType: "Balanced",
  preferences: ["Natural coverage"],
};

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = usePersistentState(STORAGE_KEYS.profile, defaultProfile);
  const [routineResults, setRoutineResults] = usePersistentState<StoredRoutine>(
    STORAGE_KEYS.routine,
    [],
  );
  const [recentlyViewed, setRecentlyViewed] = usePersistentState<ProductId[]>(
    STORAGE_KEYS.recent,
    [],
  );

  // Stable actions: safe to use as effect dependencies (see ProductPage).
  const actions = useMemo<CustomerActions>(
    () => ({
      saveProfile: (nextProfile) => setProfile(nextProfile),
      saveRoutine: (result) => setRoutineResults(result),
      addRecentlyViewed: (id) => setRecentlyViewed((items) => addRecentlyViewedItem(items, id)),
    }),
    [setProfile, setRecentlyViewed, setRoutineResults],
  );

  const value = useMemo<CustomerState>(
    () => ({ profile, routineResults, recentlyViewed, ...actions }),
    [actions, profile, recentlyViewed, routineResults],
  );
  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}

export const useCustomer = (): CustomerState => {
  const value = useContext(CustomerContext);
  if (!value) throw new Error("useCustomer must be used inside CustomerProvider");
  return value;
};
