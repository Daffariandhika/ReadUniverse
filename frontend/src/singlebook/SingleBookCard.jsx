import PropTypes from 'prop-types';

import AnimatedBook from './SingleBookAnimation';

const SingleBookCard = ({ imageURL }) => {
  return <AnimatedBook imageURL={imageURL} />;
};

SingleBookCard.propTypes = {
  imageURL: PropTypes.string.isRequired,
};

export default SingleBookCard;
