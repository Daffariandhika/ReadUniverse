import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import CardReview from '../components/CardReview';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchReviews = async () => {
      setHasError(false);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/all-feedback`);
        if (!response.ok) throw new Error('Failed to fetch reviews.');
        const data = await response.json();
        setReviews(shuffleArray(data));
      } catch (error) {
        console.error('Failed to fetch reviews:', error.message);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="px-2 pb-32">
      <h2 className="ligature animate-glow bg-gradient-to-b from-Teal to-Indigo bg-clip-text text-center text-6xl text-transparent">
        Reviews from Across the Galaxy
      </h2>

      <Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
        className="mySwiper h-auto w-full"
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={5}
      >
        {(isLoading || hasError ? Array(5).fill(null) : reviews).map((review, index) => (
          <SwiperSlide
            key={review?._id ?? index}
            className="flex items-center justify-center py-12"
          >
            <div className="m-2 h-[256px] w-[400px]">
              <CardReview
                book={review?.product}
                loading={isLoading || hasError}
                review={review}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Review;
