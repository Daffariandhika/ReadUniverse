import rainbow from '../assets/Image/rainbow.png';

const MyDecoration = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-topSpace">
      <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-50"></div>
      <img
        alt="Rainbow MyDecoration"
        className="absolute left-80 h-full w-full animate-glow object-contain"
        src={rainbow}
      />
      <img
        alt="Rainbow MyDecoration"
        className="absolute left-28 top-60 h-full -rotate-45 animate-glow object-contain"
        src={rainbow}
      />
      <div className="absolute inset-0 z-10 bg-Darkness opacity-0"></div>
    </div>
  );
};

export default MyDecoration;
