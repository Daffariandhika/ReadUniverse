// src/contexts/NotificationProvider.jsx
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from './AuthContext';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const [unreadRes, readRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/notifications/${user.uid}`),
        fetch(`${import.meta.env.VITE_API_URL}/notifications/readed/${user.uid}`),
      ]);

      const [unreadData, readData] = await Promise.all([
        unreadRes.json(),
        readRes.json(),
      ]);

      const merged = [...unreadData, ...readData];
      setNotifications(merged);
      setUnreadCount(unreadData.length);
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  }, [user?.uid]);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const markAsRead = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/mark-notification-read/${id}`, {
      method: 'PUT',
    });
    setNotifications((prev) => {
      const updated = prev.map((n) => (n._id === id ? { ...n, read: true } : n));
      setUnreadCount(updated.filter((n) => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/mark-all-read/${user.uid}`, {
      method: 'PUT',
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        removeNotification(id);
      } else {
        console.error('Failed to delete notification');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const toRemove = prev.find((n) => n._id === id);
      const updated = prev.filter((n) => n._id !== id);
      if (toRemove && !toRemove.read) {
        setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
      }
      return updated;
    });
  };

  useEffect(() => {
    const debounced = debounce(fetchNotifications, 300);
    debounced();
    return () => debounced.cancel();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        unreadNotifications,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
