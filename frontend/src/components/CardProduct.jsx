import PropTypes from 'prop-types';

const CardProduct = ({
  children,
  height = '354px',
  padding = '0px',
  width = '244px',
}) => {
  return (
    <div
      className={`relative z-30 overflow-hidden rounded-md bg-Sepia font-semibold shadow-card transition-all duration-700 [text-shadow:1px_1px_1px_#43CBFF;] after:absolute after:bottom-0 after:left-5 after:-z-20 after:h-1 after:w-1 after:translate-y-full after:rounded-md after:bg-gradientNebula after:transition-all after:duration-700 hover:[text-shadow:2px_2px_2px_#0A0A0a] after:hover:scale-[300] after:hover:transition-all after:hover:duration-700`}
      style={{ width, height, padding }}
    >
      {children}
    </div>
  );
};

CardProduct.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CardProduct;
