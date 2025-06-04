import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import bookCategory from '../utils/BookCategory';

const Header = ({ booksCount, loading, onCategorySelect, query }) => {
  const [message, setMessage] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const gradientColors = [
    'from-Indigo to-Indigo',
    'from-zinc-900 to-zinc-900',
    'from-stone-900 to-stone-900',
  ];

  useEffect(() => {
    if (loading) {
      setMessage('Searching Through The Universe of Books...');
      setShowRecommendations(false);
    } else if (!query && booksCount > 0) {
      setMessage(`Over ${booksCount} Books Available In Our Shop`);
    } else if (booksCount === 0 && query) {
      setMessage(`No Results Found For "${query}".`);
      setShowRecommendations(true);
    } else if (booksCount > 0) {
      setMessage(`${booksCount} Book${booksCount > 1 ? 's' : ''} Found For "${query}".`);
      setShowRecommendations(false);
    } else {
      setMessage('Welcome! Start your book exploration journey.');
    }
  }, [loading, booksCount, query]);

  return (
    <div className="my-6 text-center">
      <p
        className={clsx(
          'ligature text-2xl transition-transform duration-500',
          loading
            ? 'animate-pulse text-Teal'
            : 'bg-gradient-to-b from-Teal to-Blue bg-clip-text text-transparent',
        )}
      >
        {message}
      </p>
      {showRecommendations && (
        <div className="mt-6 animate-fadeIn text-sm text-gray-400">
          <p className="ligature bg-gradient-to-b from-Blue to-Teal bg-clip-text text-xl text-transparent">
            Need Inspiration? Check Out These Categories:
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-6 px-6">
            {bookCategory.map((category, index) => (
              <li key={index}>
                <button
                  className={`rounded-full bg-gradient-to-r px-4 py-2 ${
                    gradientColors[index % gradientColors.length]
                  } transform cursor-pointer text-sm font-semibold tracking-wider text-white shadow-md transition-all duration-300 ease-in-out hover:scale-110 hover:bg-gradient-to-br hover:from-Purple hover:to-Teal hover:text-Darkness hover:shadow-xl`}
                  title={`View books in ${category}`}
                  onClick={() => onCategorySelect(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  onCategorySelect: PropTypes.func.isRequired,
  booksCount: PropTypes.number,
  loading: PropTypes.bool,
  query: PropTypes.string,
};

export default Header;
