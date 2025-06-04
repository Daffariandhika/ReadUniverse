import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import Loading from '../loader/Loading';

const ProtectedRoute = ({ element }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate
        replace
        to="/404-not-found"
      />
    );
  }

  return <Suspense fallback={<Loading />}>{element}</Suspense>;
};

export default ProtectedRoute;
