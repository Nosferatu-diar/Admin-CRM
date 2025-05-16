import React from "react";

interface UseDebounceProps<T> {
  value: T;
  delay?: number;
}

export default function useDebounce<T>({
  value,
  delay = 500,
}: UseDebounceProps<T>): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
