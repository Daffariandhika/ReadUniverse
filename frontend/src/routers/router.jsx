import { createBrowserRouter } from 'react-router-dom';

import LazyLoadRoute from './LazyLoadRoute';
import ProtectedRoute from './ProtectedRoute';
import * as Routes from './routes';

const bookLoader = async ({ params }) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/book/${params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch book data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading book:', error);
    throw new Response('Not Found', { status: 404 });
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LazyLoadRoute element={<Routes.App />} />,
    children: [
      { path: '/', element: <LazyLoadRoute element={<Routes.Home />} /> },
      { path: '/shop', element: <LazyLoadRoute element={<Routes.Shop />} /> },
      {
        path: '/contact',
        element: <LazyLoadRoute element={<Routes.ContactUs />} />,
      },
      {
        path: '/sign-up',
        element: <LazyLoadRoute element={<Routes.SignUp />} />,
      },
      {
        path: '/sign-in',
        element: <LazyLoadRoute element={<Routes.SignIn />} />,
      },
      {
        path: '/forgot-password',
        element: <LazyLoadRoute element={<Routes.ForgotPassword />} />,
      },
      {
        path: '/404-not-found',
        element: <LazyLoadRoute element={<Routes.NotFound />} />,
      },
      {
        path: '/cart',
        element: <ProtectedRoute element={<LazyLoadRoute element={<Routes.Cart />} />} />,
      },
      {
        path: '/notification',
        element: (
          <ProtectedRoute element={<LazyLoadRoute element={<Routes.Notification />} />} />
        ),
      },
      {
        path: '/liked-book',
        element: (
          <ProtectedRoute element={<LazyLoadRoute element={<Routes.LikedBook />} />} />
        ),
      },
      {
        path: '/my-orders',
        element: (
          <ProtectedRoute element={<LazyLoadRoute element={<Routes.Order />} />} />
        ),
      },
      {
        path: '/checkout',
        element: (
          <ProtectedRoute element={<LazyLoadRoute element={<Routes.Checkout />} />} />
        ),
      },
      {
        path: '/feedback',
        element: (
          <ProtectedRoute element={<LazyLoadRoute element={<Routes.FeedbackForm />} />} />
        ),
      },
      {
        path: '/book/:id',
        element: <LazyLoadRoute element={<Routes.SingleBook />} />,
        loader: bookLoader,
      },
    ],
  },

  // Admin Dashboard Routes
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute element={<LazyLoadRoute element={<Routes.Layout />} />} />,
    children: [
      { path: '', element: <LazyLoadRoute element={<Routes.Dashboard />} /> },
      {
        path: 'upload',
        element: <LazyLoadRoute element={<Routes.UploadBook />} />,
      },
      {
        path: 'manage',
        element: <LazyLoadRoute element={<Routes.ManageBook />} />,
      },
      {
        path: 'users',
        element: <LazyLoadRoute element={<Routes.ManageUser />} />,
      },
      {
        path: 'orders',
        element: <LazyLoadRoute element={<Routes.ManageOrder />} />,
      },
      {
        path: 'edit-books/:id',
        element: <LazyLoadRoute element={<Routes.EditBook />} />,
        loader: bookLoader,
      },
    ],
  },
]);

export default router;
