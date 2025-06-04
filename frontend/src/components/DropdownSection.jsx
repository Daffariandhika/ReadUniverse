import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';

const DropdownSection = ({ children, maxHeight = 'max-h-60', title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl bg-Indigo p-4 shadow-md">
      <button
        className="flex w-full items-center justify-between text-left text-lg font-semibold text-White transition duration-200 hover:text-Sky"
        onClick={() => setOpen(!open)}
      >
        {title}
        <svg
          className={`h-5 w-5 transform transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className={`mt-3 overflow-hidden text-sm text-gray-300`}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`overflow-y-auto ${maxHeight} custom-scrollbar pr-1`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

DropdownSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  maxHeight: PropTypes.string,
};

export default DropdownSection;
