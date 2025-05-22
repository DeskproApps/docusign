import { useEffect, useState } from "react";

export default function useDebounce<T>(
  value: T,
  delay: number
): {
  debouncedValue: T;
  setDebouncedValue: React.Dispatch<React.SetStateAction<T>>;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, setDebouncedValue };
}
