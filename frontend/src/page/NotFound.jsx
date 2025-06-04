import UFO from '../assets/Image/ufo.png';
import ButtonPrimary from '../components/ButtonPrimary';

const NotFound = () => {
  return (
    <div className="flex h-screen items-center bg-Darkness">
      <div className="container flex flex-col items-center justify-between px-5 text-gray-700 md:flex-row">
        <div className="mx-8 w-full lg:w-1/2">
          <div className="mb-8 bg-gradient-to-t from-teal-400 via-blue-500 to-purple-500 bg-clip-text text-7xl font-extrabold text-transparent">
            401
          </div>
          <p className="mb-8 text-2xl font-light leading-normal md:text-3xl">
            Authentication required to unlock this part of the galaxy.
          </p>
          <ButtonPrimary
            className="flex w-1/4"
            to="/"
          >
            Home
          </ButtonPrimary>
        </div>
        <div className="mx-5 my-12 w-full lg:flex lg:w-1/2 lg:justify-end">
          <img
            alt="Page not found"
            className="object-contain brightness-75 contrast-125 saturate-150"
            src={UFO}
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
