import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to debounce a value, delaying updates until the user stops typing or a specific delay passes.
 * This is useful for situations where you want to avoid triggering actions like network requests or filtering immediately after each change.
 *
 * @param {any} value - The value to be debounced.
 * @param {number} [delay=300] - The debounce delay in milliseconds. Defaults to 300ms.
 * @param {function|null} [callback=null] - Optional callback to be invoked when the debounced value changes.
 * @returns {any} - The debounced value that updates after the specified delay.
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 500, (value) => console.log(value));
 * // debouncedSearch will update after 500ms, and the callback will log the value.
 *
 * // If no callback is provided, only the debounced value is returned.
 * const debouncedValue = useDebounce(inputValue, 500);
 */
const useDebounce = (value, delay = 300, callback = null) => {
  const [debouncedValue, setDebouncedValue] = useState(value); // State to store the debounced value
  const callbackRef = useRef(callback); // Ref to store the current callback function

  // Update the callback ref whenever the callback function changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value); // Set the debounced value after the delay
      if (callbackRef.current) {
        callbackRef.current(value); // Invoke the callback with the debounced value, if it exists
      }
    }, delay);

    // Cleanup the timeout when the component is unmounted or when value/delay changes
    return () => clearTimeout(handler);
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue; // Return the debounced value
};

export default useDebounce;
