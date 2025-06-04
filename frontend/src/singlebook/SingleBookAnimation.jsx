import PropTypes from 'prop-types';

const SingleBookCardAnimation = ({ imageURL }) => {
  return (
    <div
      className="single-book-container"
      style={{ '--background-image': `url(${imageURL})` }}
    >
      <div className="single-book">
        <img
          alt="Book Cover"
          src={imageURL}
        />
      </div>
    </div>
  );
};

SingleBookCardAnimation.propTypes = {
  imageURL: PropTypes.string.isRequired,
};

export default SingleBookCardAnimation;
