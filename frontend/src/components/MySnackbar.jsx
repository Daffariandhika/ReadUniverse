import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const variantStyles = {
  success: {
    bgColor: 'bg-Indigo',
    textColor: 'text-lime-300',
    iconColor: 'text-lime-400',
    message: 'Success - Operation completed!',
    icon: (
      <path
        d="M4.5 12.75l6 6 9-13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  error: {
    bgColor: 'bg-Indigo',
    textColor: 'text-rose-300',
    iconColor: 'text-rose-400',
    message: 'Error - Something went wrong!',
    icon: (
      <path
        d="M6 18 18 6M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  info: {
    bgColor: 'bg-Indigo',
    textColor: 'text-cyan-300',
    iconColor: 'text-cyan-400',
    message: 'Info - Just a heads-up!',
    icon: (
      <path
        d="M12 9v2m0 4h.01M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  warning: {
    bgColor: 'bg-Indigo',
    textColor: 'text-amber-300',
    iconColor: 'text-amber-400',
    message: 'Warning - Proceed with caution!',
    icon: (
      <path
        d="M12 9v3m0 3h.01M4.5 19.5h15l-7.5-15z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
};

const snackbarVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 120,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

const MySnackbar = ({
  autoHideDuration = 3000,
  iconSize = 'w-7 h-7',
  message,
  onClose,
  open,
  position = 'bottom-left',
  showIcon = true,
  type = 'success',
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  const {
    bgColor,
    icon,
    iconColor,
    message: defaultMsg,
    textColor,
  } = variantStyles[type] || variantStyles.success;

  const positionClass =
    {
      'top-left': 'top-5 left-5',
      'top-right': 'top-5 right-5',
      'bottom-left': 'bottom-5 left-5',
      'bottom-right': 'bottom-5 right-5',
    }[position] || 'bottom-5 left-5';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate="visible"
          className={`fixed z-50 flex flex-col gap-2 ${positionClass}`}
          exit="exit"
          initial="hidden"
          variants={snackbarVariants}
        >
          <motion.div
            className={`relative flex items-center rounded-xl px-4 py-2 shadow-2xl transition-all duration-300 ease-in-out ${bgColor} min-w-[250px] max-w-md`}
          >
            {showIcon && (
              <div className={`rounded-lg p-1 ${iconColor}`}>
                <svg
                  className={`${iconSize}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {icon}
                </svg>
              </div>
            )}
            <p className={`ml-3 flex-1 break-words text-sm font-medium ${textColor}`}>
              {message || defaultMsg}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

MySnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  autoHideDuration: PropTypes.number,
  iconSize: PropTypes.string,
  message: PropTypes.string,
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  showIcon: PropTypes.bool,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
};

export default MySnackbar;
