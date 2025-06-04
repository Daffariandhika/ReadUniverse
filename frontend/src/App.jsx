import { Outlet, useLocation } from 'react-router-dom';

import MyFooter from './page/MyFooter';
import Navbar from './page/Navbar';
import './App.css';

function App() {
  const location = useLocation();

  const hideNavbarAndFooterPaths = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/404-not-found',
    '/contact',
    '/feedback',
    '/checkout',
  ];
  const shouldHideLayout = hideNavbarAndFooterPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow bg-Darkness">
        <Outlet />
      </main>
      {!shouldHideLayout && <MyFooter />}
    </div>
  );
}

export default App;
