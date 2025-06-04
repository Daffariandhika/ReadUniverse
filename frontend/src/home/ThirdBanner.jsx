import { useEffect, useState } from 'react';
import { FaRocket } from 'react-icons/fa';

import BannerPic from '../assets/Image/astronaut2.png';
import ButtonPrimary from '../components/ButtonPrimary';

const ThirdBanner = () => {
  const [animatedUserCount, setAnimatedUserCount] = useState(0);
  const [animatedReviewCount, setAnimatedReviewCount] = useState(0);
  const [animatedOrderCount, setAnimatedOrderCount] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/count-all-users`)
      .then((response) => response.json())
      .then((data) => {
        animateCount(setAnimatedUserCount, data.count);
      });

    fetch(`${import.meta.env.VITE_API_URL}/count-user-reviews`)
      .then((response) => response.json())
      .then((data) => {
        animateCount(setAnimatedReviewCount, data.count);
      });

    fetch(`${import.meta.env.VITE_API_URL}/count-user-order`)
      .then((response) => response.json())
      .then((data) => {
        animateCount(setAnimatedOrderCount, data.count);
      });
  }, []);

  const animateCount = (setState, targetValue) => {
    let start = 0;
    const duration = 1000;
    const increment = targetValue / (duration / 16);

    const updateCount = () => {
      start += increment;
      if (start >= targetValue) {
        setState(targetValue);
      } else {
        setState(Math.floor(start));
        requestAnimationFrame(updateCount);
      }
    };
    updateCount();
  };

  return (
    <div className="relative flex items-center justify-around bg-bottomSpace py-44">
      <div className="pointer-events-none absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="w-1/2 space-y-8">
        <h2 className="animate-glow bg-gradient-to-l from-Mint to-DeepPurple bg-clip-text text-6xl font-bold leading-snug text-transparent">
          Step Into the Infinite. Books for Every Journey Among the Stars!
        </h2>
        <div className="flex flex-row justify-between">
          <div className="bg-gradient-to-b from-Blue to-Teal bg-clip-text text-transparent">
            <h3 className="text-3xl font-bold">{animatedUserCount}+</h3>
            <p className="text-lg">Registered User</p>
          </div>
          <div className="bg-gradient-to-b from-Blue to-Teal bg-clip-text text-transparent">
            <h3 className="text-3xl font-bold">{animatedReviewCount}+</h3>
            <p className="text-lg">User Reviews</p>
          </div>
          <div className="bg-gradient-to-b from-Blue to-Teal bg-clip-text text-transparent">
            <h3 className="text-3xl font-bold">{animatedOrderCount}+</h3>
            <p className="text-lg">Order Success</p>
          </div>
          <ButtonPrimary
            className="w-1/4 hover:animate-shake"
            icon={FaRocket}
            iconSize={20}
            to="/sign-up"
          >
            Read More
          </ButtonPrimary>
        </div>
      </div>
      <div className="w-[460px]">
        <img
          alt="Astronaut"
          className="animate-hovering object-contain"
          src={BannerPic}
        />
      </div>
    </div>
  );
};

export default ThirdBanner;
