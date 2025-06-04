import axios from 'axios';
import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Custom hook to manage the shopping cart.
 * Provides functionality to fetch, add to, and update the cart, as well as manage notifications.
 *
 * @param {Array} books - Array of books available in the store.
 * @returns {Object} - The hook's return value containing the following properties:
 *   - `cartData`: Array of cart items with the book IDs and quantities.
 *   - `error`: Error message if any error occurred during cart operations.
 *   - `snackbar`: Object containing the current snackbar state (`open`, `message`, `type`).
 *   - `getCartQuantity`: Function to get the quantity of a specific book in the cart.
 *   - `handleAddToCart`: Function to handle adding a book to the cart.
 *   - `refreshCart`: Function to manually refresh the cart data.
 *   - `setSnackbar`: Function to manually set the snackbar state (useful for custom notifications).
 *
 * @example
 * const { cartData, error, snackbar, handleAddToCart, getCartQuantity } = useCart(books);
 *
 * // To add a book to the cart:
 * handleAddToCart(bookId);
 *
 * // To get the quantity of a specific book in the cart:
 * const quantity = getCartQuantity(bookId);
 *
 * // To display a snackbar message:
 * setSnackbar({ open: true, message: 'Book added to cart!', type: 'success' });
 */
const useCart = (books = []) => {
  const [cartData, setCartData] = useState([]); // Holds the current cart items
  const [error, setError] = useState(null); // Error state for any issues fetching or modifying the cart
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' }); // Snackbar state for feedback

  const token = useMemo(() => localStorage.getItem('token'), []); // Retrieves the token for authenticated requests

  /**
   * Fetches the current cart data from the backend.
   * The data includes the list of books in the cart with quantities.
   */
  const fetchCartData = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(data?.cart || []); // Sets the cart data from the response
    } catch (err) {
      console.error('Fetch cart error:', err);
      setError('Could not fetch cart data.'); // Sets an error message on failure
    }
  }, [token]);

  useEffect(() => {
    fetchCartData(); // Fetches the cart data when the hook is first run
  }, [fetchCartData]);

  /**
   * Returns the quantity of a specific book in the cart.
   *
   * @param {string} bookId - The ID of the book.
   * @returns {number} - The quantity of the book in the cart.
   */
  const getCartQuantity = useCallback(
    (bookId) =>
      cartData.find((item) => item.bookId === bookId || item.bookId?._id === bookId)
        ?.quantity || 0,
    [cartData],
  );

  /**
   * Adds a book to the cart, ensuring stock limits and user authentication are respected.
   *
   * @param {string} bookId - The ID of the book to add to the cart.
   */
  const handleAddToCart = useCallback(
    async (bookId) => {
      setSnackbar({ open: false, message: '', type: '' }); // Reset snackbar state

      if (!token) {
        setSnackbar({
          open: true,
          message: 'Please log in to add items to your cart.',
          type: 'error',
        });
        return;
      }

      const book = books.find((b) => b._id === bookId); // Find the book by ID
      if (!book) {
        setSnackbar({ open: true, message: 'Book not found.', type: 'error' });
        return;
      }

      const quantityInCart = getCartQuantity(bookId); // Get current quantity in the cart

      if (book.stock <= 0) {
        setSnackbar({
          open: true,
          message: 'This book is currently out of stock.',
          type: 'warning',
        });
        return;
      }

      if (quantityInCart >= book.stock) {
        setSnackbar({
          open: true,
          message: `Only ${book.stock} available. You've reached the limit.`,
          type: 'warning',
        });
        return;
      }

      const updatedCart = cartData.map((item) =>
        item.bookId === bookId || item.bookId?._id === bookId
          ? { ...item, quantity: item.quantity + 1 } // Update the quantity if book is already in the cart
          : item,
      );
      const exists = cartData.some(
        (item) => item.bookId === bookId || item.bookId?._id === bookId,
      );
      if (!exists) updatedCart.push({ bookId, quantity: 1 }); // If the book is not in the cart, add it

      setCartData(updatedCart); // Update cart data in state

      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/cart/add`,
          { bookId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        await fetchCartData(); // Refresh cart data from server

        setSnackbar({
          open: true,
          message: `"${book.title}" added to cart (${quantityInCart + 1}).`,
          type: 'success',
        });
      } catch (err) {
        console.error('Add to cart error:', err);
        setCartData(cartData); // Revert cart data on error
        setSnackbar({
          open: true,
          message: 'Could not add to cart. Please try again.',
          type: 'error',
        });
      }
    },
    [token, books, cartData, getCartQuantity, fetchCartData],
  );

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false })); // Close snackbar after 3 seconds
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  return {
    cartData,
    error,
    snackbar,
    getCartQuantity,
    handleAddToCart,
    refreshCart: fetchCartData, // Exposes the function to manually refresh cart data
    setSnackbar, // Allows manual control of snackbar state
  };
};

export default useCart;
