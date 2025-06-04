import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

import ButtonPrimary from './ButtonPrimary';
import ReviewSkeleton from '../loader/ReviewSkeleton';

const CardReview = ({ loading, review }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getStarColor = (index) => {
    if (index < review.rating) {
      switch (review.rating) {
        case 5:
          return 'text-blue-400 drop-shadow-[0_0_8px_#3b82f6] hover:scale-110 transition-transform';
        case 4:
          return 'text-green-400 drop-shadow-[0_0_8px_#22c55e] hover:scale-110 transition-transform';
        case 3:
          return 'text-purple-400 drop-shadow-[0_0_8px_#a855f7] hover:scale-110 transition-transform';
        case 2:
          return 'text-orange-400 drop-shadow-[0_0_8px_#f97316] hover:scale-110 transition-transform';
        case 1:
          return 'text-red-400 drop-shadow-[0_0_8px_#ef4444] hover:scale-110 transition-transform';
        default:
          return 'text-TransparentWhite';
      }
    }
    return 'text-TransparentWhite';
  };

  return (
    <StyledWrapper
      $isFlipped={isFlipped}
      onClick={handleFlip}
    >
      <div className="card">
        <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-front rounded-xl border-2 border-Indigo bg-Sepia p-5 shadow-lg">
            {loading ? (
              <ReviewSkeleton isBack={false} />
            ) : (
              <div>
                <div className="flex justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      alt={review.name}
                      className="h-14 w-14 rounded-full object-cover"
                      src={review.profileImage}
                    />
                    <div>
                      <p className="mb-1 text-lg font-semibold text-White">
                        {review.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={getStarColor(i)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-right text-[14px] font-normal italic text-DarkGray">
                    {review.date}
                  </p>
                </div>
                <div className="mt-3 h-[2px] w-full rounded-full bg-Indigo"></div>
                <div className="mt-2 bg-gradient-to-br from-Teal via-Blue to-Purple bg-clip-text text-justify text-[16px] font-normal italic text-transparent">
                  {review.comment}
                </div>
              </div>
            )}
          </div>
          <div className="card-back flex rotate-180 transform flex-col justify-between rounded-xl border-2 border-Navy bg-gradient-to-b from-Sepia to-[#1a1a2e] p-5 text-White shadow-lg">
            {loading ? (
              <ReviewSkeleton isBack={true} />
            ) : (
              <>
                <div className="mb-4 flex flex-col items-center">
                  <p className="ligature mb-4 bg-gradient-to-r from-Teal via-Blue to-Purple bg-clip-text text-center text-lg text-transparent">
                    {review.product}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={getStarColor(i)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex flex-grow flex-col items-center">
                  <p className="mb-4 text-center italic text-Gray">
                    {review.rating >= 4
                      ? 'A stellar favorite across the galaxy!'
                      : review.rating === 3
                        ? 'An interstellar pick for explorers!'
                        : 'A comet bright for some, fading for others.'}
                  </p>
                </div>
                <div className="flex flex-row justify-evenly">
                  <ButtonPrimary to={`/book/${review.productId}`}>
                    View Product
                  </ButtonPrimary>
                  <ButtonPrimary>Add to Wishlist</ButtonPrimary>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 405px;
    height: 268px;
    perspective: 1000px;
    cursor: pointer;
  }
  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.9s ease-in-out;
  }
  .card-inner.flipped {
    transform: rotateY(180deg);
  }
  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
  }
  .card-back {
    transform: rotateY(180deg);
  }
`;

CardReview.propTypes = {
  loading: PropTypes.bool.isRequired,
  review: PropTypes.shape({
    comment: PropTypes.string,
    date: PropTypes.string,
    name: PropTypes.string,
    product: PropTypes.string,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    profileImage: PropTypes.string,
    rating: PropTypes.number,
  }),
};

export default CardReview;
