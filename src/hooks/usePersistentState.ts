import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { storageRepository, type StorageKey } from "../repositories/storageRepository";

/**
 * useState backed by localStorage.
 *
 * The first render always uses `initialValue` so server and client markup match;
 * the stored value is read after mount. `hydrated` tells callers when it is safe to
 * act on the stored value (e.g. before redirecting away from an "empty" checkout).
 */
export function usePersistentState<T>(
  key: StorageKey,
  initialValue: T,
): [value: T, setValue: Dispatch<SetStateAction<T>>, hydrated: boolean] {
  const initialRef = useRef(initialValue);
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(storageRepository.read(key, initialRef.current));
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (hydrated) storageRepository.write(key, value);
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}
