import { useState, useEffect, useCallback } from "react";

export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Initialize state from localStorage if available, otherwise use initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (e) {
      console.error(`Error reading localStorage key "${key}":`, e);
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setState((currentVal) => {
          const valueToStore = value instanceof Function ? value(currentVal) : value;
          localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch custom event to notify other hook instances in the same window
          window.dispatchEvent(new Event("storage_sync"));
          return valueToStore;
        });
      } catch (e) {
        console.error(`Error writing localStorage key "${key}":`, e);
      }
    },
    [key]
  );

  // Sync with other instances of useLocalStorageState using 'storage' and 'storage_sync' events
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      if (e instanceof StorageEvent) {
        if (e.key === key) {
          if (e.newValue === null) {
            setState(initialValue);
          } else {
            try {
              setState(JSON.parse(e.newValue) as T);
            } catch (err) {
              console.error(err);
            }
          }
        }
      } else if (e.type === "storage_sync") {
        // Custom same-window storage event
        try {
          const saved = localStorage.getItem(key);
          if (saved) {
            setState(JSON.parse(saved) as T);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage_sync", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage_sync", handleStorageChange);
    };
  }, [key, initialValue]);

  return [state, setValue];
}
