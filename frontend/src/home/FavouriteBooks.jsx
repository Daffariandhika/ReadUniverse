import { useEffect, useState } from 'react';

import BookCards from '../page/BookCards';

const FavouriteBook = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/top-books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books.');
      }
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div>
      <h2 className="ligature animate-glow bg-gradient-to-b from-Teal to-Indigo bg-clip-text p-2 text-center text-6xl tracking-wide text-transparent">
        Top Favourite Among the Stars
      </h2>
      <BookCards
        books={books}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default FavouriteBook;
