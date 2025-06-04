import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import BookLoader from '../loader/BookLoader';

const AnimatedBook = ({ imageURL, to }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const preloadImage = new Image();
  preloadImage.src = imageURL;

  return (
    <Link
      className="book-container py-2"
      style={{ '--background-image': `url(${imageURL})` }}
      to={to}
    >
      {loading && (
        <div className="py-14">
          <BookLoader />
        </div>
      )}
      <div
        className="book"
        style={{ display: loading ? 'none' : 'block' }}
      >
        <img
          alt="Book Cover"
          loading="eager"
          src={imageURL}
          onLoad={handleImageLoad}
        />
      </div>
    </Link>
  );
};

AnimatedBook.propTypes = {
  imageURL: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default AnimatedBook;
