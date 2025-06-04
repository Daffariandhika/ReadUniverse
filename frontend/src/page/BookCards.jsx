import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import MySnackbar from '../components/MySnackbar';
import useCart from '../hooks/useCart';
import BookSkeleton from '../loader/BookSkeleton';
import Element from '../shop/Element';
import { ShuffleBook } from '../utils/ShuffleBook';

const BookCards = ({ books }) => {
  const [shuffledBooks, setShuffledBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCartQuantity, handleAddToCart, setSnackbar, snackbar } = useCart(books);

  useEffect(() => {
    if (books.length > 0) {
      setLoading(true);
      const shuffled = ShuffleBook(books);
      setShuffledBooks(shuffled);
      setLoading(false);
    }
  }, [books]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <Swiper
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        className="mySwiper h-full w-full"
        pagination={false}
        slidesPerView={1}
        spaceBetween={8}
      >
        {(loading ? Array.from({ length: 15 }) : shuffledBooks).map((book, index) => (
          <SwiperSlide
            key={book?._id || index}
            className="mt-4 flex justify-center p-2"
          >
            {loading ? (
              <BookSkeleton />
            ) : (
              <Element
                book={book}
                loading={loading}
                quantity={getCartQuantity(book?._id)}
                showSnackbar={(msg, type) =>
                  setSnackbar({ message: msg, type, open: true })
                }
                onAddToCart={handleAddToCart}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <MySnackbar
        message={snackbar.message}
        open={snackbar.open}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};

BookCards.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageURL: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      authorName: PropTypes.string,
      averageRating: PropTypes.number,
      category: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      likes: PropTypes.number,
      stock: PropTypes.number,
    }),
  ).isRequired,
};

export default BookCards;
