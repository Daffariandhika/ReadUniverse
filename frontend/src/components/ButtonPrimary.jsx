import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const ButtonPrimary = ({
  ariaLabel = 'Button',
  children,
  className,
  icon: Icon,
  iconSize = 14,
  isLoading,
  onClick,
  to,
  type = 'button',
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="group relative w-full">
        <button
          aria-label={ariaLabel}
          className={`shadow-form-shadow relative inline-block w-full cursor-pointer rounded-xl p-px font-semibold leading-6 text-white transition-all duration-300 ease-in-out ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 active:scale-95'}`}
          disabled={isLoading}
          type={type}
          onClick={handleClick}
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-Teal via-Blue to-Purple p-[2px] opacity-0 shadow-button transition-opacity duration-500 group-hover:opacity-100"></span>
          <span className="relative z-10 block rounded-xl bg-Navy px-6 py-3">
            <div className="relative z-10 flex items-center justify-center space-x-3">
              {isLoading ? (
                <CircularProgress
                  className="text-white"
                  size={iconSize}
                />
              ) : (
                <>
                  {Icon && (
                    <Icon
                      className="transition-all duration-500"
                      size={iconSize}
                    />
                  )}
                  <span className="transition-all duration-500">{children}</span>
                </>
              )}
            </div>
          </span>
        </button>
      </div>
    </div>
  );
};

ButtonPrimary.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
  iconSize: PropTypes.number,
  isLoading: PropTypes.bool,
  to: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
};

export default ButtonPrimary;
