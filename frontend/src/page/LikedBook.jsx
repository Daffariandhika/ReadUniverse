import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AnimatedText from '../components/AnimatedText';
import MySnackbar from '../components/MySnackbar';
import useCart from '../hooks/useCart';
import Loading from '../loader/Loading';
import RenderProductCard from '../section/RenderProductCard';

const LikedBooks = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingBookId, setRemovingBookId] = useState(null);
  const [removedBookIds, setRemovedBookIds] = useState([]);
  const [error, setError] = useState(null);
  const { getCartQuantity, handleAddToCart, setSnackbar, snackbar } = useCart(likedBooks);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('You must be logged in to view liked books.');

        const res = await axios.get(`${import.meta.env.VITE_API_URL}/liked-books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedBooks(res.data?.likedBooks);
      } catch (err) {
        console.error('Error fetching liked books:', err);
        setError(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedBooks();
  }, []);

  const handleRemoveLike = async (bookId) => {
    if (!bookId) {
      return setSnackbar({ open: true, message: 'Invalid book ID.', type: 'error' });
    }
    try {
      setRemovingBookId(bookId);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to remove liked books.');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/book/${bookId}/likes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response?.data?.liked === false) {
        setSnackbar({
          open: true,
          message: 'Removed from your liked books.',
          type: 'success',
        });
        setRemovedBookIds((prev) => [...prev, bookId]);
      } else {
        setSnackbar({ open: true, message: 'Could not remove book.', type: 'error' });
      }
    } catch (err) {
      console.error('Error removing liked book:', err);
      setSnackbar({ open: true, message: 'Failed to remove liked book.', type: 'error' });
    } finally {
      setRemovingBookId(null);
    }
  };

  const closeSnackbar = () => setSnackbar({ open: false, message: '', type: '' });

  if (loading) return <Loading />;

  if (error) {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className="flex h-screen flex-col items-center justify-center p-4 text-center"
        initial={{ opacity: 0 }}
      >
        <h1 className="mb-4 text-3xl font-bold text-red-500 drop-shadow-lg">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-400">{error}</p>
      </motion.div>
    );
  }
  if (likedBooks.length === 0) {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-screen flex-col items-center justify-center p-6 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <AnimatedText Headline="No Liked Books Yet" />
        <p className="mt-2 text-white/50">Explore the shop!</p>
        <motion.button
          className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-indigo-500/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/shop')}
        >
          Browse the Shop
        </motion.button>
      </motion.div>
    );
  }
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.h1
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 mt-20 bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-center text-4xl font-extrabold text-transparent drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Your Liked Books
      </motion.h1>
      <motion.div
        layout
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence
          mode="popLayout"
          onExitComplete={() => {
            if (removedBookIds.length > 0) {
              setLikedBooks((prev) =>
                prev.filter((book) => !removedBookIds.includes(book._id)),
              );
              setRemovedBookIds([]);
            }
          }}
        >
          {likedBooks.map((book) =>
            removedBookIds.includes(book._id) ? null : (
              <motion.div
                key={book._id}
                layout
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
                exit={{
                  opacity: 0,
                  scale: 0.7,
                  transition: { duration: 0.3, ease: 'easeInOut' },
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{
                  opacity: { duration: 0.3, ease: 'easeInOut' },
                  scale: { duration: 0.3, ease: 'easeInOut' },
                }}
              >
                <RenderProductCard
                  book={book}
                  loading={removingBookId === book._id}
                  quantity={getCartQuantity(book._id)}
                  onAddToCart={() => handleAddToCart(book._id)}
                  onRemoveLike={handleRemoveLike}
                />
              </motion.div>
            ),
          )}
        </AnimatePresence>
      </motion.div>
      <MySnackbar
        message={snackbar.message}
        open={snackbar.open}
        type={snackbar.type}
        onClose={closeSnackbar}
      />
    </motion.div>
  );
};

export default LikedBooks;
