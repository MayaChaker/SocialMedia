import { useEffect, useState } from "react";
import { storageRepository } from "../repositories/storageRepository";
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => storageRepository.read(key, initialValue));
  useEffect(() => storageRepository.write(key, value), [key, value]);
  return [value, setValue];
}
