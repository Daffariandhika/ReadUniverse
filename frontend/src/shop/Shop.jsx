import { lazy, Suspense } from 'react';

import Loading from '../loader/Loading';

const Page = lazy(() => import('./Page'));

const Shop = () => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative min-h-screen bg-Darkness">
        <div className="relative z-10">
          <Page />
        </div>
      </div>
    </Suspense>
  );
};

export default Shop;
