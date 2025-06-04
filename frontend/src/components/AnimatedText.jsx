import PropTypes from 'prop-types';
import styled from 'styled-components';

const AnimatedText = ({ Headline }) => {
  return (
    <StyledWrapper>
      <div className="animated">{Headline}</div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated {
    font-size: 2rem;
    font-family: sans-serif;
    font-variant: small-caps;
    font-weight: 900;
    background: conic-gradient(
      #2dd4bf 0 25%,
      #3b82f6 25% 50%,
      #9708cc 50% 75%,
      #a855f7 75%
    );
    background-size: 200% 200%;
    animation: animateBackground 4.5s ease-in-out infinite;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  }

  @keyframes animateBackground {
    25% {
      background-position: 0 100%;
    }

    50% {
      background-position: 100% 100%;
    }

    75% {
      background-position: 100% 0%;
    }

    100% {
      background-position: 0 0;
    }
  }
`;

AnimatedText.propTypes = {
  Headline: PropTypes.string.isRequired,
};

export default AnimatedText;
