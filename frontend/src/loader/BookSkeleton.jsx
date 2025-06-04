const BookSkeleton = () => (
  <div className="skeleton space-y-4">
    <div className="flex justify-around px-4">
      <div className="shimmer h-6 w-24 rounded-2xl bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
      <div className="shimmer absolute right-2 top-2 h-9 w-9 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
    </div>
    <div className="shimmer mx-auto h-44 w-32 rounded-md bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
    <div className="shimmer mx-auto h-5 w-48 rounded-2xl bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
    <div className="flex justify-center gap-2">
      <div className="shimmer h-4 w-16 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
      <div className="shimmer h-4 w-16 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
    </div>
    <div className="flex flex-row gap-[10px]">
      <div className="shimmer mx-auto h-6 w-12 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
      <div className="shimmer mx-auto h-6 w-12 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
      <div className="shimmer mx-auto h-6 w-12 rounded bg-gradient-to-r from-transparent via-TransparentWhite to-transparent"></div>
    </div>
  </div>
);

export default BookSkeleton;
