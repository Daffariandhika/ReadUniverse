import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';

import MySnackbar from './MySnackbar';

const DropdownCategory = ({
  id,
  maxSelection = 3,
  options,
  selectedOption,
  setSelectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    if (selectedOption.includes(option)) {
      setSelectedOption(selectedOption.filter((item) => item !== option));
    } else if (selectedOption.length < maxSelection) {
      setSelectedOption([...selectedOption, option]);
    } else {
      setShowSnackbar(true);
    }
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOutsideClick = useCallback(
    (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFilteredOptions(options);
      }
    },
    [options],
  );

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredOptions(options.filter((option) => option.toLowerCase().includes(term)));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full rounded-xl border-2 border-Indigo bg-Darkness px-4 py-4 text-left tracking-wide text-White outline-none focus:outline-none"
        id={id}
        type="button"
        onClick={toggleDropdown}
      >
        {selectedOption.length > 0 ? selectedOption.join(', ') : 'Select Category'}
        <span className="float-right">▼</span>
      </button>
      {isOpen && (
        <div className="max-h-50 absolute z-10 mt-2 w-full origin-top scale-100 transform overflow-auto rounded-lg border-2 border-Indigo bg-Darkness text-White shadow-lg transition-all duration-200 ease-out">
          <input
            className="w-full border-none bg-transparent p-4 text-White outline-none focus:ring-0"
            placeholder="Search..."
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  aria-selected={selectedOption.includes(option)}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2"
                  role="option"
                  tabIndex={0}
                  onClick={() => handleSelect(option)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(option);
                  }}
                >
                  <label
                    className="checkbox-container"
                    htmlFor={`checkbox-${option}`}
                  >
                    <input
                      checked={selectedOption.includes(option)}
                      className="custom-checkbox"
                      id={`checkbox-${option}`}
                      type="checkbox"
                      onChange={() => handleSelect(option)}
                    />
                    <span className="checkmark"></span>
                    <span className="sr-only">{`Select ${option}`}</span>
                  </label>
                  <span>{option}</span>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
      <MySnackbar
        message={`Maximum of ${maxSelection} options can be selected.`}
        open={showSnackbar}
        type="warning"
        onClose={() => setShowSnackbar(false)}
      />
    </div>
  );
};

DropdownCategory.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOption: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  id: PropTypes.string,
  maxSelection: PropTypes.number,
};

export default DropdownCategory;
