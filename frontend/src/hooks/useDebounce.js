import { useEffect, useState } from 'react';

/**
 * Devuelve una versión "debounced" del valor dado: solo se actualiza
 * después de que pase `delayMs` sin que el valor original cambie.
 *
 * @param {*} value
 * @param {number} delayMs
 */
export function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
