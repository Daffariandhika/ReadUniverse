import PropTypes from 'prop-types';

const ButtonSecondary = ({
  bgColor = 'bg-rose-400',
  children,
  className = '',
  hoverBgColor = 'bg-rose-800',
  hoverTextShadow = 'hover:[text-shadow:2px_2px_2px_#fda4af]',
  onClick,
  padding = 'px-8 py-4',
  shadowColor = 'shadow-lg',
  size = 'text-2xl',
  textColor = 'text-white',
  textShadow = '[text-shadow:3px_5px_2px_#be123c;]',
}) => {
  return (
    <button
      className={`${padding} z-30 ${bgColor} ${textColor} ${shadowColor} relative rounded-md font-semibold after:absolute after:-z-20 after:h-1 after:w-1 after:${hoverBgColor} overflow-hidden transition-all duration-700 after:bottom-0 after:left-5 after:translate-y-full after:rounded-md after:transition-all after:duration-700 after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 ${textShadow} ${hoverTextShadow} ${size} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

ButtonSecondary.propTypes = {
  children: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
  className: PropTypes.string,
  hoverBgColor: PropTypes.string,
  hoverTextShadow: PropTypes.string,
  padding: PropTypes.string,
  shadowColor: PropTypes.string,
  size: PropTypes.string,
  textColor: PropTypes.string,
  textShadow: PropTypes.string,
  onClick: PropTypes.func,
};

export default ButtonSecondary;
