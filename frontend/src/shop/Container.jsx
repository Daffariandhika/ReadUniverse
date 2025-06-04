import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Element from './Element';
import Header from './Header';
import Pagination from './Pagination';
import MySnackbar from '../components/MySnackbar';
import useCart from '../hooks/useCart';
import useDebounce from '../hooks/useDebounce';

const BOOKS_PER_PAGE = 20;

const Container = ({ books, onCategorySelect, query }) => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [likedBooks, setLikedBooks] = useState([]);

  const debouncedQuery = useDebounce(query, 1000);

  const { getCartQuantity, handleAddToCart, setSnackbar, snackbar } = useCart(books);

  useEffect(() => {
    const fetchLikedBooks = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/liked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedBooks(response.data.likedBooks || []);
      } catch (error) {
        console.error('Failed to fetch liked books:', error);
      }
    };
    fetchLikedBooks();
  }, []);

  useEffect(() => {
    setLoading(true);
    const filtered = debouncedQuery
      ? books.filter((book) => {
          const queryLower = debouncedQuery.toLowerCase();
          const titleMatch = book.title?.toLowerCase().includes(queryLower);
          const categoryMatch =
            Array.isArray(book.category) &&
            book.category.some((cat) => cat.toLowerCase().includes(queryLower));
          return titleMatch || categoryMatch;
        })
      : books;

    setFilteredBooks(filtered);
    setCurrentPage(1);

    setTimeout(() => setLoading(false), 500);
  }, [books, debouncedQuery]);

  const displayedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE,
  );

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  return (
    <div>
      <Header
        booksCount={filteredBooks.length}
        loading={loading}
        query={debouncedQuery}
        onCategorySelect={onCategorySelect}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: BOOKS_PER_PAGE }).map((_, index) => (
              <div key={index}>
                <Element
                  book={null}
                  loading={true}
                />
              </div>
            ))
          : displayedBooks.map((book) => (
              <div key={book._id}>
                <Element
                  book={book}
                  likedBooks={likedBooks}
                  loading={false}
                  quantity={getCartQuantity(book._id)}
                  showSnackbar={(msg, type) =>
                    setSnackbar({ message: msg, type, open: true })
                  }
                  onAddToCart={() => handleAddToCart(book._id)}
                />
              </div>
            ))}
      </div>
      {filteredBooks.length > BOOKS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          loading={loading}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {snackbar.message && (
        <MySnackbar
          message={snackbar.message}
          open={snackbar.open}
          type={snackbar.type}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
};

Container.propTypes = {
  books: PropTypes.array.isRequired,
  query: PropTypes.string,
  onCategorySelect: PropTypes.func,
};

export default Container;
