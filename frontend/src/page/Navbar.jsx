/* eslint-disable react-hooks/exhaustive-deps */
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import Navbarlogo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import DropdownUser from '../components/DropdownUser';
import MySnackbar from '../components/MySnackbar';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');
  const [profileImage, setProfileImage] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isActive = location.pathname === '/cart';

  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTokenExpiry = () => {
    localStorage.removeItem('token');
    setProfileImage(null);
    signOut();
    setSnackbarMessage('Your session has expired. Please log in again.');
    setSnackbarType('info');
    setSnackbarOpen(true);
    navigate('/');
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const expirationTime = decoded.exp * 1000;
          const currentTime = Date.now();

          if (currentTime >= expirationTime) {
            handleTokenExpiry();
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          handleTokenExpiry();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const handleSellBookClick = () => {
    if (!user) {
      setSnackbarMessage('Please log in to access Sell Your Book.');
      setSnackbarType('warning');
      setSnackbarOpen(true);
    } else {
      navigate('/admin/dashboard');
    }
    closeMenu();
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setProfileImage(null);
    signOut();
    setSnackbarMessage('You have been logged out successfully.');
    setSnackbarType('success');
    setSnackbarOpen(true);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (user && user.uid) {
      fetch(`${import.meta.env.VITE_API_URL}/user/${user.uid}`)
        .then((response) => response.json())
        .then((data) => {
          setProfileImage(data.profileImage || null);
          setCreatedAt(data.createdAt || null);
        })
        .catch((err) => {
          console.error('Failed to fetch user profile:', err);
          setProfileImage(null);
          setCreatedAt(null);
        });
    }
  }, [user]);

  const navItems = [
    { link: 'Home', path: '/' },
    { link: 'Shop', path: '/shop' },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-Darkness shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav
        className={`py-4 transition-all duration-500 ease-in-out lg:px-8 ${
          isScrolled ? 'bg-Darkness' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-8 text-base">
          <Link
            className="flex items-center gap-2 bg-gradient-to-r from-Teal via-Blue to-Purple bg-clip-text text-2xl font-bold text-transparent"
            to="/"
          >
            <img
              alt="Logo"
              className="inline-block h-10 w-10"
              src={Navbarlogo}
            />
            ReadUniverse
          </Link>
          <ul className="hidden space-x-8 md:flex">
            {navItems.map(({ link, path }) => (
              <NavLink
                key={path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-base font-bold uppercase text-Sky'
                    : 'text-base font-bold uppercase text-White transition-all duration-500 hover:text-Sky'
                }
                to={path}
                onClick={closeMenu}
              >
                {link}
              </NavLink>
            ))}
            <button
              className="text-base font-bold uppercase text-White transition-all duration-500 hover:text-Sky"
              onClick={handleSellBookClick}
            >
              Sell Your Book
            </button>
          </ul>
          <div className="hidden items-center space-x-6 lg:flex">
            <NavLink
              className={`${
                isActive
                  ? 'text-Sky'
                  : 'text-White transition-all duration-500 hover:text-Sky'
              } transition-all`}
              to={user ? '/cart' : '#'}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  setSnackbarMessage('Please log in to access the cart.');
                  setSnackbarType('warning');
                  setSnackbarOpen(true);
                }
              }}
            >
              <FaShoppingCart className="h-6 w-6" />
            </NavLink>
            {user ? (
              <DropdownUser
                created={createdAt}
                handleSignOut={handleSignOut}
                isDropdownOpen={isDropdownOpen}
                profileImage={profileImage}
                toggleDropdown={setIsDropdownOpen}
                user={user}
              />
            ) : (
              <ButtonPrimary
                className="animate-popIn"
                to="/sign-in"
              >
                Login
              </ButtonPrimary>
            )}
          </div>
          <div className="md:hidden">
            <button
              className="text-White"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaXmark className="text-aquaCyan h-5 w-5" />
              ) : (
                <FaBarsStaggered className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`bg-Darkness px-4 py-7 md:hidden ${isMenuOpen ? 'fixed top-16 block w-full' : 'hidden'}`}
        >
          {navItems.map(({ link, path }) => (
            <NavLink
              key={path}
              className={({ isActive }) =>
                isActive
                  ? 'block text-base font-bold uppercase text-Sky'
                  : 'block text-base font-bold uppercase text-White hover:text-Sky'
              }
              to={path}
              onClick={closeMenu}
            >
              {link}
            </NavLink>
          ))}
          <button
            className="block text-base font-bold uppercase text-White hover:text-Sky"
            onClick={handleSellBookClick}
          >
            Sell Your Book
          </button>
        </div>
      </nav>
      <MySnackbar
        message={snackbarMessage}
        open={snackbarOpen}
        type={snackbarType}
        onClose={() => setSnackbarOpen(false)}
      />
    </header>
  );
};

export default Navbar;
