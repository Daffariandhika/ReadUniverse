import { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useLoaderData } from 'react-router-dom';

import SingleBookCard from './SingleBookCard';
import MySnackbar from '../components/MySnackbar';
import useCart from '../hooks/useCart';
import useLike from '../hooks/useLike';
import { CategoryColor } from '../utils/CategoryColor';

const DESCRIPTION_WORD_LIMIT = 40;

const SingleBook = () => {
  const book = useLoaderData();
  const { _id, authorName, category, description, imageURL, likes, price, stock, title } =
    book;

  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });
  const [showFullDesc, setShowFullDesc] = useState(false);

  const {
    getCartQuantity,
    handleAddToCart,
    setSnackbar: setCartSnackbar,
    snackbar: cartSnackbar,
  } = useCart([book]);
  const { likeCount, loadingLike, setLikeCount, toggleLike, userLikes } = useLike(
    _id,
    (message, type) => setSnackbar({ open: true, message, type }),
  );

  const cartQuantity = getCartQuantity(_id);

  useEffect(() => {
    setLikeCount(likes || 0);
  }, [likes, setLikeCount]);

  const handleToggleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbar({
        open: true,
        message: 'You need to be logged in to like books.',
        type: 'error',
      });
      return;
    }
    await toggleLike();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    setCartSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderCategories = () => {
    const categories = Array.isArray(category) ? category : [category];
    return categories.map((cat) => (
      <span
        key={cat}
        className={`rounded-full px-4 py-1 text-sm shadow-md ${CategoryColor(cat)} max-w-[200px] truncate`}
        title={cat}
      >
        {cat}
      </span>
    ));
  };

  const truncateDescription = (desc, limit) => {
    const words = desc.split(' ');
    if (words.length <= limit) return desc;
    return words.slice(0, limit).join(' ') + '...';
  };

  return (
    <div className="animate-fade-in mb-16 flex flex-col items-center gap-12 px-4 sm:px-8 lg:mt-28 lg:flex-row lg:items-start lg:gap-10 lg:px-24">
      <div className="w-full sm:w-3/4 lg:w-1/2">
        <SingleBookCard imageURL={imageURL} />
      </div>

      <div className="book-details w-full text-white lg:w-1/2">
        <h2 className="text-shadow-gray mb-4 text-3xl font-bold tracking-wide sm:text-4xl">
          {title}
        </h2>
        <h3 className="mb-4 text-lg font-bold text-White sm:text-xl">by {authorName}</h3>

        <div className="mb-4 flex flex-wrap gap-2">{renderCategories()}</div>

        <p className="mb-3 text-justify text-sm leading-relaxed text-gray-300 transition-all duration-500 ease-in-out sm:text-base">
          {showFullDesc
            ? description
            : truncateDescription(description, DESCRIPTION_WORD_LIMIT)}
        </p>

        {description.split(' ').length > DESCRIPTION_WORD_LIMIT && (
          <button
            className="text-sm font-medium text-Sky transition hover:text-opacity-80"
            onClick={() => setShowFullDesc(!showFullDesc)}
          >
            {showFullDesc ? 'Read Less' : 'Read More'}
          </button>
        )}

        <div className="mb-8 mt-4 text-xl font-semibold text-White sm:text-2xl">
          {price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
          })}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            aria-label="Add to cart"
            className="flex w-36 items-center justify-center gap-2 rounded-md bg-Sky p-2 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-opacity-80"
            onClick={() => handleAddToCart(_id)}
          >
            <FaShoppingCart />
            <span>Add to Cart</span>
          </button>

          <button
            aria-disabled={loadingLike}
            aria-label="Like or unlike book"
            className="Btn-like transition duration-300"
            disabled={loadingLike}
            onClick={handleToggleLike}
          >
            <span
              className={`leftContainer transition-all duration-300 hover:bg-opacity-80 ${userLikes ? 'bg-Rose' : 'bg-Sky'}`}
            >
              <svg
                fill="#fff"
                height="1em"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"></path>
              </svg>
              <span className="like">
                {loadingLike ? '...' : userLikes ? 'Liked' : 'Like'}
              </span>
            </span>
            <span
              className={`likeCount transition duration-700 ${userLikes ? 'text-Rose' : 'text-Sky'}`}
            >
              {likeCount.toLocaleString()}
            </span>
          </button>
        </div>
      </div>

      <MySnackbar
        message={snackbar.open ? snackbar.message : cartSnackbar.message}
        open={snackbar.open || cartSnackbar.open}
        type={snackbar.open ? snackbar.type : cartSnackbar.type}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default SingleBook;
