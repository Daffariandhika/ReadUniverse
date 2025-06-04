import PropTypes from 'prop-types';

const ReviewSkeleton = ({ isBack = false }) => {
  return (
    <div className="skeleton flex flex-col gap-3">
      {!isBack ? (
        <>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="shimmer h-14 w-14 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="flex flex-col items-center">
                <div className="shimmer h-5 w-32 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
                <div className="mt-2 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="shimmer h-5 w-5 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="shimmer h-4 w-20 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
          </div>
          <div className="h-[2px] w-full rounded-full bg-Indigo"></div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-[70%] rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-1/2 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-1/2 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-[90%] rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-1/2 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-2/6 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
            <div className="flex flex-row gap-3">
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-2/6 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
          </div>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="shimmer h-5 w-5 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"
              ></div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-2/6 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="shimmer h-6 w-full rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
              <div className="shimmer h-6 w-2/6 rounded-full bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            </div>
          </div>
          <div className="flex justify-evenly">
            <div className="shimmer h-10 w-32 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
            <div className="shimmer h-10 w-32 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
          </div>
        </>
      )}
    </div>
  );
};

ReviewSkeleton.propTypes = {
  isBack: PropTypes.bool.isRequired,
};

export default ReviewSkeleton;
