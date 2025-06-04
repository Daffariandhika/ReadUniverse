import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  FaBell,
  FaClipboardList,
  FaCog,
  FaComments,
  FaHeart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

import { useNotification } from '../contexts/NotificationContext';
import { UserBadge } from '../utils/UserBadge.jsx';

const DropdownUser = ({
  created,
  handleSignOut,
  isDropdownOpen,
  profileImage,
  toggleDropdown,
  user,
}) => {
  const { markAllAsRead, markAsRead, unreadCount, unreadNotifications } =
    useNotification();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const badge = UserBadge(created);

  useEffect(() => {
    toggleDropdown(false);
  }, [location.pathname, toggleDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        toggleDropdown(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') toggleDropdown(false);
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen, toggleDropdown]);

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      to: '/user-setting',
      icon: <FaCog />,
    },
    {
      label: 'Dashboard',
      to: '/dashboard',
      icon: <FaTachometerAlt />,
    },
    {
      label: 'Feedback',
      to: '/feedback',
      icon: <FaComments />,
    },
    {
      label: 'My Orders',
      to: '/my-orders',
      icon: <FaClipboardList />,
    },
    {
      label: 'Liked Books',
      to: '/liked-book',
      icon: <FaHeart />,
    },
    {
      label: 'Notifications',
      to: '/notification',
      icon: <FaBell />,
      badge: unreadCount,
    },
  ];

  const avatar = profileImage ? (
    <img
      alt="User Avatar"
      className="h-10 w-10 rounded-full object-cover shadow-md"
      loading="lazy"
      src={profileImage}
      onError={(e) => (e.target.style.display = 'none')}
    />
  ) : (
    <FaUserCircle className="h-10 w-10 text-White" />
  );

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="User menu"
        className="relative rounded-full transition hover:ring-2 hover:ring-Sky focus:outline-none focus-visible:ring-2 focus-visible:ring-Sky"
        onClick={() => toggleDropdown(!isDropdownOpen)}
      >
        <div className="relative">
          {avatar}
          {unreadCount > 0 && (
            <div className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center">
              <span className="absolute h-full w-full scale-110 animate-ping rounded-full bg-Rose/70 blur-[2px]" />
              <span className="absolute h-full w-full rounded-full bg-Rose opacity-40 blur-[3px]" />
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-Rose text-[10px] font-bold text-white shadow-[0_0_6px_rgba(239,68,68,0.8)] ring-1 ring-white/10 transition-transform duration-300 ease-out group-hover:scale-105">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </div>
      </button>
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            <motion.div
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => toggleDropdown(false)}
            />
            <motion.div
              key="dropdown"
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="fixed right-4 top-16 z-50 max-h-[85vh] w-[92vw] max-w-xs overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] shadow-2xl ring-1 ring-[#2a2a2a] backdrop-blur-md sm:w-80"
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#0f0f0f]/80 to-[#111]/80 px-4 py-3">
                <img
                  alt="User Avatar"
                  className={`h-[60px] w-[60px] rounded-full object-cover ${badge.glow}`}
                  src={profileImage}
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white/95 drop-shadow">
                    {user?.displayName}
                  </p>
                  <p className="truncate text-xs text-White/60">{user?.email}</p>
                  {badge && (
                    <span
                      className={`mb-0.5 rounded px-3 py-0.5 text-xs font-bold ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  )}
                </div>
              </div>
              <motion.ul
                animate="show"
                className="flex flex-col gap-1 p-3"
                initial="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
              >
                {menuItems.map(({ badge, icon, label, to }) => (
                  <motion.li
                    key={label}
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: -4,
                      },
                      show: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                  >
                    <Link
                      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        location.pathname === to
                          ? 'bg-[#1e1e1e] text-Sky'
                          : 'text-white hover:bg-[#1e1e1e] hover:text-Sky'
                      }`}
                      to={to}
                      onClick={() => toggleDropdown(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base transition-transform group-hover:scale-110">
                          {icon}
                        </span>
                        {label}
                      </span>
                      {badge > 0 && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white shadow">
                          {badge}
                        </span>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              {unreadNotifications.length > 0 && (
                <div className="border-t border-[#2a2a2a] px-4 py-3">
                  <div className="sticky top-0 z-10 mb-2 flex items-center justify-between backdrop-blur-sm">
                    <h3 className="text-xs font-semibold text-gray-400">
                      Recent Notifications
                    </h3>
                    <button
                      className="text-xs text-blue-400 hover:underline"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <ul className="max-h-40 space-y-2">
                    {unreadNotifications.slice(0, 1).map((n) => (
                      <motion.li
                        key={n._id}
                        layout
                        animate={{ opacity: 1, y: 0 }}
                        className={`group relative cursor-pointer rounded-md px-3 py-2 text-sm transition-all hover:bg-[#1a1a1a] ${n.read ? 'text-gray-400' : 'font-semibold text-white'}`}
                        exit={{ opacity: 0, y: -5 }}
                        initial={{ opacity: 0, y: 5 }}
                        title={n.message}
                        onClick={() => handleNotificationClick(n._id)}
                      >
                        <div className="flex items-center gap-2">
                          <FaBell className="text-sm text-Sky" />
                          <span className="flex-1 truncate">{n.message}</span>
                          <span className="whitespace-nowrap text-xs text-gray-500">
                            {formatDistanceToNow(new Date(n.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                          {!n.read && (
                            <span className="ml-2 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  <Link
                    className="mt-1 block text-right text-xs text-blue-500 hover:underline"
                    to="/notification"
                  >
                    View all
                  </Link>
                </div>
              )}
              <div className="border-t border-[#2a2a2a] px-3 py-2">
                <button
                  className="group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold text-white transition hover:bg-[#1a1a1a] hover:text-Red"
                  onClick={() => {
                    handleSignOut();
                    toggleDropdown(false);
                  }}
                >
                  <FaSignOutAlt className="text-base transition-transform group-hover:scale-110" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownUser;
