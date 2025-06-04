import { CircularProgress } from '@mui/material';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';

import ButtonPrimary from './ButtonPrimary';

const MyModal = ({
  actionButtons = [],
  additionalContent = null,
  backdropClassName = '',
  closeButton,
  closeButtonClass = '',
  closeButtonColor = 'text-gray-900',
  description = '',
  disableBackdropClick = false,
  disableEscapeKey = false,
  isLoading = false,
  loadingIndicator,
  modalClassName = '',
  onClose,
  open,
  size = 'md',
  title = '',
  usePortal = true,
}) => {
  const modalRef = useRef(null);

  const handleFocusTrap = useCallback((e) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;
    const isShiftPressed = e.shiftKey;

    if (isShiftPressed && activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!isShiftPressed && activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  useEffect(() => {
    if (open) {
      const previousFocusedElement = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');

      const focusableElements = modalRef.current?.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      focusableElements?.[0]?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !disableEscapeKey) {
          onClose?.();
        }
        handleFocusTrap(e);
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleKeyDown);
        previousFocusedElement?.focus();
      };
    }
  }, [open, onClose, handleFocusTrap, disableEscapeKey]);

  const handleBackdropClick = (e) => {
    if (!disableBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const sizeClasses = {
    sm: 'w-11/12 max-w-sm',
    md: 'w-11/12 max-w-md',
    lg: 'w-11/12 max-w-lg',
  };

  const closeButtonMarkup = closeButton || (
    <button
      aria-label="Close Modal"
      className={classNames(
        'transition duration-300 hover:text-red-500',
        closeButtonColor,
        closeButtonClass,
      )}
      data-testid="custom-modal-close"
      onClick={onClose}
    >
      <IoClose size={24} />
    </button>
  );

  const backdrop = (
    <motion.div
      animate={{ opacity: 1 }}
      aria-describedby="modal-description"
      aria-labelledby="modal-title"
      aria-modal="true"
      className={classNames(
        'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80',
        backdropClassName,
      )}
      data-testid="custom-modal-backdrop"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      role="dialog"
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
        animate={{ opacity: 1, scale: 1 }}
        className={classNames(
          'relative max-h-[90vh] transform overflow-y-auto rounded-xl border-2 border-gray-900 bg-Darkness p-6 shadow-xl',
          sizeClasses[size],
          modalClassName,
        )}
        data-testid="custom-modal"
        exit={{ opacity: 0, scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.95 }}
        tabIndex={-1}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="text-2xl font-bold text-White"
            id="modal-title"
          >
            {title}
          </h2>
          {closeButtonMarkup}
        </div>
        {description && (
          <p
            className="mb-4 text-gray-400"
            id="modal-description"
          >
            {description}
          </p>
        )}
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            {loadingIndicator || <CircularProgress />}
          </div>
        ) : (
          additionalContent && (
            <div className="mb-4 text-gray-300">
              {Array.isArray(additionalContent)
                ? additionalContent.map((item, i) => (
                    <div key={i}>{JSON.stringify(item)}</div>
                  ))
                : additionalContent}
            </div>
          )
        )}
        {actionButtons.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {actionButtons.map((btn, i) => (
              <ButtonPrimary
                key={i}
                className={btn.className || ''}
                disabled={btn.disabled}
                onClick={btn.onClick}
              >
                {btn.loading ? 'Loading...' : btn.label}
              </ButtonPrimary>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );

  const content = <AnimatePresence>{open && backdrop}</AnimatePresence>;

  return usePortal ? ReactDOM.createPortal(content, document.body) : content;
};

MyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      disabled: PropTypes.bool,
      loading: PropTypes.bool,
    }),
  ),
  additionalContent: PropTypes.node,
  backdropClassName: PropTypes.string,
  closeButton: PropTypes.node,
  closeButtonClass: PropTypes.string,
  closeButtonColor: PropTypes.string,
  description: PropTypes.string,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKey: PropTypes.bool,
  isLoading: PropTypes.bool,
  loadingIndicator: PropTypes.node,
  modalClassName: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  title: PropTypes.string,
  usePortal: PropTypes.bool,
};

export default MyModal;
