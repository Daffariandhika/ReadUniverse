import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * Custom hook to manage the "like" functionality for books.
 * Provides functionality to toggle a like, fetch the user's liked books, and display like count.
 *
 * @param {string} bookId - The ID of the book being liked or unliked.
 * @param {function} showSnackbar - A function to show snackbar notifications (success/error messages).
 * @param {Array} initialLikedBooks - Initial list of liked books, used to set the initial state for the `userLikes` state.
 * @returns {Object} - The hook's return value containing the following properties:
 *   - `userLikes`: Boolean indicating whether the current book is liked by the user.
 *   - `likeCount`: Number of likes for the current book.
 *   - `loadingLike`: Boolean indicating if the "like" action is being processed.
 *   - `toggleLike`: Function to toggle the like status for the current book.
 *   - `setLikeCount`: Function to manually set the like count (useful for external control).
 *
 * @example
 * const { userLikes, likeCount, loadingLike, toggleLike } = useLike(bookId, showSnackbar, initialLikedBooks);
 *
 * // To toggle the like status for the book:
 * toggleLike();
 *
 * // To display the like count:
 * console.log(likeCount);
 */
export const useLike = (bookId, showSnackbar, initialLikedBooks = []) => {
  const [userLikes, setUserLikes] = useState(initialLikedBooks.includes(bookId)); // State for whether the book is liked by the user
  const [likeCount, setLikeCount] = useState(0); // State for the count of likes on the book
  const [loadingLike, setLoadingLike] = useState(false); // State for managing the loading state while the like action is being processed

  /**
   * Fetches the user's liked books and updates the `userLikes` state based on whether the current book is liked.
   */
  useEffect(() => {
    const fetchUserLikes = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const likedBooks = response.data.likedBooks || [];
        setUserLikes(likedBooks.includes(bookId)); // Update the state based on the bookId
      } catch (error) {
        console.error('Error fetching user likes:', error);
      }
    };
    fetchUserLikes(); // Trigger the API call to fetch liked books when the component mounts or `bookId` changes
  }, [bookId]);

  /**
   * Toggles the like status for the book. If liked, it is removed, and if unliked, it is added.
   * Sends the request to the server and updates the state accordingly.
   */
  const toggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showSnackbar('You need to be logged in to like books.', 'error'); // Show error if not logged in
      return;
    }
    setLoadingLike(true); // Set loading state to true while the like action is being processed
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/book/${bookId}/likes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserLikes(response.data.liked); // Update whether the user likes the book
      setLikeCount(response.data.likes); // Update the like count
      showSnackbar(
        response.data.liked
          ? 'Book added to your liked books.'
          : 'Book removed from your liked books.',
        'success',
      ); // Show success message based on the result
    } catch (error) {
      console.error('Error toggling like:', error);
      showSnackbar('Failed to toggle like.', 'error'); // Show error if the like action fails
    } finally {
      setLoadingLike(false); // Set loading state to false after the action is completed
    }
  };

  return {
    userLikes, // Whether the current book is liked by the user
    likeCount, // The total like count of the book
    loadingLike, // Whether the like action is being processed
    toggleLike, // Function to toggle the like status
    setLikeCount, // Function to manually set the like count
  };
};

export default useLike;
