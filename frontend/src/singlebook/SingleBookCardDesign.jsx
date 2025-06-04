import PropTypes from 'prop-types';

const SingleBookCardDesign = ({ children }) => {
  return <div className="single-book-card">{children}</div>;
};

SingleBookCardDesign.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SingleBookCardDesign;
