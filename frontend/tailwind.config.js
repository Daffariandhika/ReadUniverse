const flowbite = require('flowbite-react/tailwind');
const textshadow = require('tailwindcss-textshadow');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      colors: {
        // Dark Shades
        Darkness: '#000000',
        TransparentBlack: 'rgba(0, 0, 0, 0.1)',
        Indigo: '#111827',
        Sepia: '#0a0a0a',
        Navy: '#030712',
        Widow: '#0c0c0c',

        // White Shades
        Gray: '#9ca3af',
        DarkGray: '#4b587c',
        White: '#EEEEEE',
        TransparentWhite: 'rgba(238, 238, 238, 0.2)',

        // Green Shades
        Mint: '#1FAB89',
        Teal: '#2DD4BF',

        // Blue Shades
        Sky: '#43CBFF',
        Blue: '#3B82F6',

        // Purple Shades
        DeepPurple: '#9708CC',
        Purple: '#A855F7',
        Violet: '#8b5cf6',
        DeepViolet: '#1e1b4b',

        // Red Shades
        Red: '#EF4444',
        Rose: '#f43f5e',
        Yellow: '#FEBA17',
      },
      backgroundImage: {
        topSpace: 'linear-gradient(to bottom, #512B81, #000000)',
        bottomSpace: 'linear-gradient(to bottom, #000000, #512B81, #000000)',
        gradientCosmic: 'linear-gradient(135deg, #000000, #030303, #060606, #0A0A0A, #000000)',
        gradientNebula: 'linear-gradient(30deg, #A855F7, #A855F7, #A855F7, #A855F7, #3B82F6, #43CBFF)',
        gradientDarkTeal: 'linear-gradient(to bottom, rgba(8, 131, 149, 0.3), rgba(13,17,23,0.3))',
      },
      boxShadow: {
        button: 'rgba(0, 0, 0, 0.5) 7px 7px',
        card: 'rgba(0, 0, 0, 0.45) 0px 25px 20px -20px',
        review: '#FFF 7px 7px',
      },
      animation: {
        explore: 'explore 10s cubic-bezier(0.25, 1, 0.5, 1) infinite',
        hovering: 'hovering 6s ease-in-out infinite alternate',
        fadeSlide: 'fadeSlide 2s ease-in-out',
        shake: 'shake 2s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-out forwards',
        slideDown: 'slideDown 0.4s ease-out forwards',
        slideUp: 'slideUp 0.4s ease-in forwards',
        popIn: 'popIn 0.8s ease-out forwards',
        popOut: 'popOut 0.4s ease-in forwards',
        orbit: 'orbit 90s linear infinite',
        glow: 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 5s linear infinite',
        fadeInScale: 'fadeInScale 0.6s ease-in-out',
        shimmer: 'shimmer 2s infinite',
        rotateShadow: 'rotateShadow 6s infinite',
        fill: 'fill 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        spaceOrbit: 'spaceOrbit 6s ease-in-out infinite',
        glowShadow: 'glowShadow 3s infinite linear',
      },
      keyframes: {
        explore: {
          '0%': {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
          },
          '20%': {
            transform: 'translate(40vw, -20vh) rotate(15deg) scale(1.05)',
          },
          '40%': {
            transform: 'translate(-30vw, 30vh) rotate(-10deg) scale(0.95)',
          },
          '60%': {
            transform: 'translate(50vw, 50vh) rotate(20deg) scale(1.1)',
          },
          '80%': {
            transform: 'translate(-40vw, -30vh) rotate(-15deg) scale(1)',
          },
          '100%': {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
          },
        },
        hovering: {
          '0%': { transform: 'translateY(10px)' },
          '100%': { transform: 'translateY(-10px)' },
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-10%)', opacity: '0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        popOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(0) scale(1)' },
          '50%': { transform: 'rotate(180deg) translateX(20px) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) translateX(0) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'saturate(1)' },
          '50%': { filter: 'saturate(2)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '0.5', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rotateShadow: {
          '0%': {
            boxShadow:
              '0px 0px 10px 3px #2DD4BF, 0px 0px 20px 6px rgba(45, 212, 191, 0.5)',
          },
          '20%': {
            boxShadow:
              '0px 0px 14px 5px #7C3AED, 0px 0px 28px 9px rgba(124, 58, 237, 0.6)',
          },
          '40%': {
            boxShadow:
              '0px 0px 18px 6px #FACC15, 0px 0px 32px 12px rgba(250, 204, 21, 0.7)',
          },
          '60%': {
            boxShadow:
              '0px 0px 16px 5px #3B82F6, 0px 0px 30px 10px rgba(59, 130, 246, 0.6)',
          },
          '80%': {
            boxShadow:
              '0px 0px 12px 4px #EC4899, 0px 0px 26px 8px rgba(236, 72, 153, 0.5)',
          },
          '100%': {
            boxShadow:
              '0px 0px 10px 3px #2DD4BF, 0px 0px 20px 6px rgba(45, 212, 191, 0.5)',
          },
        },
        fill: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spaceOrbit: {
          '0%': { transform: 'translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateX(-10px) rotate(15deg)' },
          '100%': { transform: 'translateX(0px) rotate(0deg)' },
        },
        glowShadow: {
          '0%': { boxShadow: '0px 0px 4px #2DD4BF' },
          '25%': { boxShadow: '0px 0px 6px #7C3AED' },
          '50%': { boxShadow: '0px 0px 8px #9333EA' },
          '75%': { boxShadow: '0px 0px 6px #7C3AED' },
          '100%': { boxShadow: '0px 0px 4px #2DD4BF' },
        },
      },
    },
  },
  plugins: [flowbite.plugin(), textshadow],
};
