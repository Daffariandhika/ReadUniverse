import { useEffect, useState } from 'react';

import BookCards from '../page/BookCards';

const NewBook = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-books`);
      if (!response.ok) {
        throw new Error('Failed to fetch books.');
      }
      const data = await response.json();
      const latestBooks = data.slice(-15).reverse();
      setBooks(latestBooks);
    } catch (err) {
      setError(err.message);
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
        Just Landed in Our Collection
      </h2>
      <BookCards
        books={books}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NewBook;
