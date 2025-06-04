import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { FaCircle } from 'react-icons/fa6';

import ButtonPrimary from '../components/ButtonPrimary';
import { useNotification } from '../contexts/NotificationContext';

const Notification = () => {
  const {
    deleteNotification,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
    notifications,
  } = useNotification();

  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    };
    loadData();
  }, [fetchNotifications]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    const read = notifications.filter((n) => n.read);
    setUnreadNotifications(unread);
    setReadNotifications(read);
  }, [notifications]);

  const renderNotification = (n) => (
    <li
      key={n._id}
      className="group relative"
    >
      <div
        className={`flex cursor-pointer flex-col gap-3 rounded-xl p-5 transition-all ${
          n.read
            ? 'bg-[#0c0c0c] text-gray-400 shadow-inner shadow-Darkness hover:scale-[0.99]'
            : 'bg-[#1c1c1c] text-white shadow-card hover:scale-[1.01]'
        }`}
        role="button"
        tabIndex={0}
        onClick={() => markAsRead(n._id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') markAsRead(n._id);
        }}
      >
        <div className="flex w-full items-start justify-between">
          <div className="flex items-start gap-4">
            <FaBell className="mt-1 text-2xl text-blue-400" />
            <div>
              <p className="text-base font-medium">{n.message}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              n.read
                ? 'border border-Mint/30 bg-Mint text-White'
                : 'border border-Rose/30 bg-Rose text-White'
            }`}
          >
            {n.read ? 'Readed' : 'Unreaded'}
          </span>
        </div>
        <div className="flex justify-end">
          <button
            className="group flex items-center gap-2 rounded-full border border-Rose/40 bg-Rose/20 px-3 py-1 text-sm font-semibold text-Rose opacity-0 shadow-inner shadow-Rose/10 transition-all duration-300 hover:border-Rose/60 hover:bg-Rose/30 hover:text-red-300 hover:shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-Rose/50 group-hover:opacity-100"
            onClick={async (e) => {
              e.stopPropagation();
              await deleteNotification(n._id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="container mx-auto mt-28 p-2 text-white">
      <section className="shadow-form-shadow mb-10 rounded-2xl bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="ligature bg-gradient-to-r from-Sky to-Blue bg-clip-text text-2xl font-semibold tracking-wide text-transparent">
            Notifications Center
          </h2>
          {(unreadNotifications.length > 0 || readNotifications.length > 0) && (
            <ButtonPrimary onClick={markAllAsRead}>Mark All as Read</ButtonPrimary>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading notifications...</p>
        ) : (
          <>
            {unreadNotifications.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex flex-row items-center gap-2 text-lg font-semibold text-white">
                  <FaCircle className="text-Rose" /> Unreaded
                </h3>
                <ul className="space-y-6">
                  {unreadNotifications.map(renderNotification)}
                </ul>
              </div>
            )}

            {readNotifications.length > 0 && (
              <div>
                <h3 className="mb-4 flex flex-row items-center gap-2 text-xl font-semibold text-gray-300">
                  <FaCircle className="text-Mint" /> Readed
                </h3>
                <ul className="space-y-6">{readNotifications.map(renderNotification)}</ul>
              </div>
            )}

            {readNotifications.length === 0 && unreadNotifications.length === 0 && (
              <p className="text-center text-gray-500">No notifications found.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Notification;
