import { FaRocket } from 'react-icons/fa';

import BannerPic from '../assets/Image/astronaut3.png';
import ButtonPrimary from '../components/ButtonPrimary';

const Banner = () => {
  return (
    <div className="relative flex items-center justify-around bg-topSpace pb-44 pt-32">
      <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative flex w-full animate-fadeSlide items-center justify-around">
        <div className="w-1/2 space-y-8">
          <h2 className="animate-glow bg-gradient-to-l from-Mint to-DeepPurple bg-clip-text text-6xl font-bold leading-snug text-transparent">
            Your Gateway to Infinite Adventures Await. Start Your Journey Today!
          </h2>
          <ButtonPrimary
            className="w-1/4 hover:animate-shake"
            icon={FaRocket}
            iconSize={20}
            to="/sign-up"
          >
            Join Now
          </ButtonPrimary>
        </div>
        <div className="w-[460px]">
          <img
            alt="Astronaut"
            className="animate-hovering object-contain"
            src={BannerPic}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
