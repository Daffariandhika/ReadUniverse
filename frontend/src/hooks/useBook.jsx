import axios from 'axios';
import { useEffect, useState } from 'react';

import useDebounce from './useDebounce';

/**
 * Custom hook to manage fetching and filtering a list of books.
 * It provides the functionality to fetch all books, filter them based on a search query, and handle loading and error states.
 *
 * @param {string} initialQuery - The initial query string to filter books by title or category.
 * @returns {Object} - The hook's return value containing the following properties:
 *   - `books`: Array of all books fetched from the API.
 *   - `filteredBooks`: Array of books that match the current search query.
 *   - `loading`: Boolean indicating whether books are being loaded.
 *   - `error`: Error message if there was an issue fetching the books, otherwise null.
 *
 * @example
 * const { books, filteredBooks, loading, error } = useBooks(initialQuery);
 *
 * // To access all books:
 * console.log(books);
 *
 * // To access filtered books based on the search query:
 * console.log(filteredBooks);
 *
 * // To handle loading and error states:
 * if (loading) { console.log("Loading..."); }
 * if (error) { console.log(error); }
 */
const useBooks = (initialQuery = '') => {
  const [books, setBooks] = useState([]); // State to store all books
  const [filteredBooks, setFilteredBooks] = useState([]); // State to store books filtered by query
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store error message

  const debouncedQuery = useDebounce(initialQuery, 1000); // Debounced query to avoid excessive re-rendering

  /**
   * Fetches the list of books from the API on initial load.
   */
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // Set loading state to true while fetching data
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-books`);
        setBooks(response.data); // Set all fetched books to state
        setFilteredBooks(response.data); // Set initial filtered books as all books
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.'); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading state to false after fetching is done
      }
    };
    fetchBooks(); // Fetch books on initial load
  }, []);

  /**
   * Filters the books based on the debounced query, matching against book title or category.
   * This effect runs whenever the debounced query or books state changes.
   */
  useEffect(() => {
    if (!debouncedQuery) {
      setFilteredBooks(books); // If no query, show all books
      return;
    }
    const filtered = books.filter((book) => {
      const query = debouncedQuery.toLowerCase();
      const matchesTitle = book.title?.toLowerCase().includes(query); // Check if book title matches query
      const matchesCategory =
        Array.isArray(book.category) &&
        book.category.some((cat) => cat.toLowerCase().includes(query)); // Check if any category matches query

      return matchesTitle || matchesCategory; // Return books that match either title or category
    });
    setFilteredBooks(filtered); // Set the filtered books to state
  }, [debouncedQuery, books]); // Re-run effect when query or books data changes

  return { books, filteredBooks, loading, error }; // Return state values
};

export default useBooks;
