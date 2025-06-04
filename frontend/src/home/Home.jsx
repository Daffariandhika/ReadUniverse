import { lazy, Suspense } from 'react';

import FourthBanner from './FourthBanner';
import Loading from '../loader/Loading';

const Banner = lazy(() => import('./Banner'));
const FavouriteBook = lazy(() => import('./FavouriteBooks'));
const SecondBanner = lazy(() => import('./SecondBanner'));
const NewBook = lazy(() => import('./NewBooks'));
const ThirdBanner = lazy(() => import('./ThirdBanner'));
const OtherBooks = lazy(() => import('./OtherBooks'));
const Review = lazy(() => import('./Review'));

const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="">
        <Banner />
        <FavouriteBook />
        <SecondBanner />
        <NewBook />
        <ThirdBanner />
        <OtherBooks />
        <FourthBanner />
        <Review />
      </div>
    </Suspense>
  );
};

export default Home;
