import { Badge, Spinner, Tooltip } from 'flowbite-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaHeart, FaShoppingBag, FaShoppingCart, FaStar } from 'react-icons/fa';

import AnimatedBook from '../components/AnimatedBook';
import CardProduct from '../components/CardProduct';
import MyStatistic from '../components/MyStatistic';
import useLike from '../hooks/useLike';
import BookSkeleton from '../loader/BookSkeleton';
import { Truncate } from '../utils/Truncate';

const Element = ({ book, likedBooks, loading, onAddToCart, quantity, showSnackbar }) => {
  const { likeCount, loadingLike, toggleLike, userLikes } = useLike(
    book?._id,
    showSnackbar,
    likedBooks,
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleLikeClick = () => {
    if (!loadingLike) toggleLike();
  };

  const handleAddToCartClick = async () => {
    if (!loading && book?.stock > 0 && !isAdding) {
      setIsAdding(true);
      await onAddToCart(book._id);
      setIsAdding(false);
    }
  };

  return (
    <div className="relative">
      <CardProduct
        height="384px"
        width="284px"
      >
        <div className="relative flex h-full flex-col items-center justify-between gap-3 px-4 pb-4 pt-3">
          {loading || !book ? (
            <BookSkeleton />
          ) : (
            <>
              <div className="flex w-full items-start justify-between">
                <h2 className="text-lg font-bold text-white drop-shadow-md">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(book.price)}
                </h2>
                <div className="flex items-center gap-2">
                  <Tooltip content={userLikes ? 'Unlike' : 'Like'}>
                    <button
                      aria-label="Toggle like"
                      className={`relative flex h-9 w-9 items-center justify-center rounded-lg bg-Indigo text-white transition-all duration-200 hover:scale-110 hover:bg-Navy ${loadingLike ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      disabled={loadingLike}
                      onClick={handleLikeClick}
                    >
                      {loadingLike ? (
                        <Spinner size="md" />
                      ) : (
                        <FaHeart
                          className={`text-xl transition ${userLikes ? 'animate-ping-once drop-shadow-glow text-Rose' : 'text-white'}`}
                        />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip content={book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}>
                    <button
                      aria-label="Add book to cart"
                      className={`relative flex h-9 w-9 items-center justify-center rounded-lg bg-Indigo text-white transition-all duration-200 hover:scale-110 hover:bg-Navy ${isAdding || book?.stock === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={isAdding || book.stock === 0}
                      onClick={handleAddToCartClick}
                    >
                      {isAdding ? (
                        <Spinner size="md" />
                      ) : (
                        <FaShoppingCart className="text-lg" />
                      )}
                      {quantity > 0 && (
                        <span className="animate-ping-once absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-Rose text-[10px] font-bold text-white shadow-md">
                          {quantity}
                        </span>
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
              <AnimatedBook
                imageURL={book.imageURL}
                to={`/book/${book._id}`}
              />
              <Tooltip content={book.title}>
                <h5 className="ligature cursor-help text-center text-lg font-semibold text-white">
                  {Truncate(book.title, 20)}
                </h5>
              </Tooltip>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from(new Set(book.category))
                  .slice(0, 2)
                  .map((cat, index) => (
                    <Badge
                      key={index}
                      className="ligature rounded bg-Indigo px-2 py-1 text-xs font-medium tracking-wider text-White"
                    >
                      {cat}
                    </Badge>
                  ))}
              </div>
              <div className="flex justify-center gap-6 pt-2 text-White">
                <MyStatistic
                  icon={
                    <FaStar
                      className="text-Sky"
                      size={16}
                    />
                  }
                  tooltip="Average Rating"
                  value={book.averageRating}
                />
                <MyStatistic
                  icon={
                    <FaHeart
                      className="text-Sky"
                      size={16}
                    />
                  }
                  tooltip="Total Likes"
                  value={likeCount || book.likes}
                />
                <MyStatistic
                  icon={
                    <FaShoppingBag
                      className="text-Sky"
                      size={16}
                    />
                  }
                  tooltip="Available Stock"
                  value={book.stock}
                />
              </div>
            </>
          )}
        </div>
      </CardProduct>
    </div>
  );
};

Element.propTypes = {
  showSnackbar: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  book: PropTypes.object,
  likedBooks: PropTypes.array,
  loading: PropTypes.bool,
  quantity: PropTypes.number,
};

export default Element;
