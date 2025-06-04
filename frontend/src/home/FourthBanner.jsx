import { useEffect, useState } from 'react';
import { IoMdPlanet } from 'react-icons/io';

import BannerPic from '../assets/Image/astronaut4.png';
import ButtonPrimary from '../components/ButtonPrimary';

const FourthBanner = () => {
  const [animatedStockCount, setAnimatedStockCount] = useState(0);
  const [animatedLikesCount, setAnimatedLikesCount] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/count-total-stock`)
      .then((response) => response.json())
      .then((data) => {
        animateCount(setAnimatedStockCount, data.totalStock);
      });

    fetch(`${import.meta.env.VITE_API_URL}/count-total-likes`)
      .then((response) => response.json())
      .then((data) => {
        animateCount(setAnimatedLikesCount, data.totalLikes);
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
      <div className="w-[460px]">
        <img
          alt="Astronaut"
          className="animate-hovering object-contain"
          src={BannerPic}
        />
      </div>
      <div className="w-1/2 space-y-8">
        <h2 className="animate-glow bg-gradient-to-r from-Mint to-DeepPurple bg-clip-text text-6xl font-bold leading-snug text-transparent">
          Your Portal to a Galaxy of Stories. Explore the Cosmos of Reading!
        </h2>
        <div className="flex flex-row justify-around">
          <ButtonPrimary
            className="w-1/4 hover:animate-shake"
            icon={IoMdPlanet}
            iconSize={20}
            to="/shop"
          >
            Explore
          </ButtonPrimary>
          <div className="bg-gradient-to-b from-Blue to-Teal bg-clip-text text-transparent">
            <h3 className="text-3xl font-bold">{animatedStockCount}+</h3>
            <p className="text-lg">Book Stock</p>
          </div>
          <div className="bg-gradient-to-b from-Blue to-Teal bg-clip-text text-transparent">
            <h3 className="text-3xl font-bold">{animatedLikesCount}+</h3>
            <p className="text-lg">Likes Received</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourthBanner;
