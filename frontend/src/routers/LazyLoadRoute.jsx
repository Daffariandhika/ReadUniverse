import PropTypes from 'prop-types';
import React, { Suspense } from 'react';

import Loading from '../loader/Loading';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('Error caught by ErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center bg-gradientCosmic">
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">
              Something went wrong while loading the page.
            </p>
            <button
              className="mt-4 text-blue-600 hover:text-blue-800"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

const LazyLoadRoute = ({ element }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>{element}</Suspense>
  </ErrorBoundary>
);

LazyLoadRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default LazyLoadRoute;
