import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';

import ButtonPrimary from '../components/ButtonPrimary';

const Search = ({ onSearch, searchQuery }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSearchClick = () => {
    setIsVisible(true);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsVisible(false);
    }
  };

  return (
    <div className="mt-28 flex flex-col items-center">
      {/* Search Button (Only shows if input is hidden) */}
      {!isVisible && (
        <ButtonPrimary
          className="animate-popIn"
          icon={FaSearch}
          onClick={handleSearchClick}
        >
          Search
        </ButtonPrimary>
      )}

      {/* Search Bar (Only visible when active) */}
      {isVisible && (
        <div className="relative w-full animate-popIn">
          <input
            className="h-[50px] w-72 rounded-full border-none bg-Navy pl-4 text-White outline-none transition-all duration-500 ease-in-out placeholder:text-Gray focus:scale-95 focus:animate-glowShadow focus:placeholder-White focus:ring-0"
            placeholder="Search for Book or Category . . ."
            type="text"
            value={searchQuery}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {/* Clear Button Inside MyInput */}
          {inputValue && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full bg-Navy p-2 text-gray-400 transition-all duration-300 hover:scale-110 hover:text-red-400"
              onClick={handleClear}
            >
              <FaTimesCircle size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

Search.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default Search;
