import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import ButtonPrimary from '../components/ButtonPrimary';

const Pagination = ({ currentPage, loading, onPageChange, totalPages }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
      setInputPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setInputPage(value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    } else {
      setInputPage(currentPage);
    }
  };

  return (
    <div className="my-6 flex w-full flex-col items-center gap-4">
      {/* Page Navigation Buttons */}
      <div className="flex items-center gap-2">
        <ButtonPrimary
          className="flex items-center gap-1 px-3 py-2 text-sm"
          disabled={currentPage === 1 || loading}
          onClick={() => handlePageChange(1)}
        >
          First
        </ButtonPrimary>

        <ButtonPrimary
          className="flex items-center gap-1 px-3 py-2 text-sm"
          disabled={currentPage <= 1 || loading}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ◀
        </ButtonPrimary>

        {/* Page Indicator */}
        <span className="ligature bg-gradient-to-b from-Teal to-Blue bg-clip-text text-lg tracking-widest text-transparent">
          Page {currentPage} of {totalPages}
        </span>

        <ButtonPrimary
          className="flex items-center gap-1 px-3 py-2 text-sm"
          disabled={currentPage >= totalPages || loading}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ▶
        </ButtonPrimary>

        <ButtonPrimary
          className="flex items-center gap-1 px-3 py-2 text-sm"
          disabled={currentPage === totalPages || loading}
          onClick={() => handlePageChange(totalPages)}
        >
          Last
        </ButtonPrimary>
      </div>

      {/* Jump to Page MyInput */}
      <form
        className="flex items-center gap-2"
        onSubmit={handleInputSubmit}
      >
        <input
          className="w-16 rounded-lg border-2 border-Indigo bg-Navy py-3 text-center text-White outline-none transition duration-500 ease-in-out focus:border-Blue focus:ring-0"
          inputMode="numeric"
          type="text"
          value={inputPage}
          onChange={handleInputChange}
        />
        <h1 className="text-White">/</h1>
        <span className="w-16 rounded-lg bg-Navy py-3 text-center text-White">
          {totalPages}
        </span>
        <ButtonPrimary
          className="px-3 py-1 text-sm"
          type="submit"
        >
          Go
        </ButtonPrimary>
      </form>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
