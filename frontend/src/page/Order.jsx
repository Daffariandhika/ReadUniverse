import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaCircle } from 'react-icons/fa';

import Gopay from '../assets/Image/gopay.png';
import DropdownSection from '../components/DropdownSection';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import Loading from '../loader/BookLoader';
import { Truncate } from '../utils/Truncate';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bookDetails, setBookDetails] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    orderId: null,
    action: null,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found.');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(response.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setSnackbar({
          open: true,
          message: 'Failed to fetch your orders. Please try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchBookDetails = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookDetails((prev) => ({ ...prev, [bookId]: response.data }));
    } catch (error) {
      console.error(`Failed to fetch book details for ${bookId}:`, error);
    }
  };

  const handleConfirmAction = async () => {
    const { action, orderId } = confirmModal;
    closeConfirmModal();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      if (action === 'cancel') {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/cancel-order/${orderId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: 'canceled' } : order,
          ),
        );
        setSnackbar({
          open: true,
          message: 'Order successfully canceled.',
          type: 'success',
        });
      } else if (action === 'delete') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/delete-my-order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
        setSnackbar({
          open: true,
          message: 'Order successfully deleted.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error(`Error while trying to ${action} order:`, err);
      setSnackbar({
        open: true,
        message: `Failed to ${action} the order.`,
        type: 'error',
      });
    }
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const openConfirmModal = (orderId, action) => {
    setConfirmModal({ open: true, orderId, action });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false, orderId: null, action: null });
  };

  const formatIDR = useCallback(
    (amount) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount),
    [],
  );

  const handleDetailClick = (order) => {
    setSelectedOrder(order);
    const unfetchedIds = order.items
      .map((item) => item.bookId)
      .filter((bookId) => !(bookId in bookDetails));
    Promise.all(unfetchedIds.map(fetchBookDetails));
  };

  const handleAlertClose = (_, reason) => {
    if (reason !== 'clickaway') {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }
  };

  const categorizeOrders = useCallback((orders) => {
    const result = {
      pending: [],
      approved: [],
      shipped: [],
      canceled: [],
    };
    for (const order of orders) {
      result[
        order.status === 'pending'
          ? 'pending'
          : order.status === 'approved'
            ? 'approved'
            : order.status === 'shipped'
              ? 'shipped'
              : 'canceled'
      ].push(order);
    }
    return result;
  }, []);

  const renderOrderCard = (order) => {
    const isCancelable = ['pending', 'approved'].includes(order.status);
    const isDeletable = order.status === 'canceled';

    const bgMap = {
      pending: 'bg-Yellow/10 text-Yellow border-Yellow/30',
      approved: 'bg-Mint/10 text-Mint border-Mint/30',
      shipped: 'bg-Sky/10 text-Sky border-Sky/30',
      canceled: 'bg-Rose/10 text-Rose border-Rose/30',
    };

    return (
      <motion.li
        key={order.orderId}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <motion.div
          className={`flex flex-col gap-5 rounded-2xl p-4 shadow-inner shadow-Darkness ${bgMap[order.status]} cursor-pointer transition-all duration-500 hover:shadow-card`}
          role="button"
          tabIndex={0}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleDetailClick(order)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleDetailClick(order);
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-mono text-lg font-bold tracking-wide">
                {order.orderId}
              </h3>
              <p className="text-sm italic tracking-wide text-Gray">
                {order.orderDate ? (
                  <>
                    {new Date(order.orderDate).toLocaleString('id-ID', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}{' '}
                    -{' '}
                    {formatDistanceToNow(new Date(order.orderDate), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </>
                ) : (
                  'No order date'
                )}
              </p>
            </div>
            <span
              className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize tracking-wide backdrop-blur-sm ${
                order.status === 'pending'
                  ? 'bg-Yellow/20 text-Yellow'
                  : order.status === 'approved'
                    ? 'bg-Mint/20 text-Mint'
                    : order.status === 'shipped'
                      ? 'bg-Sky/20 text-Sky'
                      : 'bg-Rose/20 text-Rose'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-Blue px-4 py-1.5 text-xs font-medium text-White opacity-0 transition-all duration-300 hover:bg-Blue/80 group-hover:opacity-100">
              View Details
            </button>
            {isCancelable && (
              <button
                className="flex items-center gap-2 rounded-lg bg-Rose px-4 py-1.5 text-xs font-medium text-White opacity-0 transition-all duration-300 hover:bg-Rose/80 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirmModal(order.orderId, 'cancel');
                }}
              >
                Cancel
              </button>
            )}
            {isDeletable && (
              <button
                className="flex items-center gap-2 rounded-lg bg-Rose px-4 py-1.5 text-xs font-medium text-White opacity-0 transition-all duration-300 hover:bg-Rose/80 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  openConfirmModal(order.orderId, 'delete');
                }}
              >
                Delete
              </button>
            )}
          </div>
        </motion.div>
      </motion.li>
    );
  };

  const { approved, canceled, pending, shipped } = useMemo(
    () => categorizeOrders(orders),
    [orders, categorizeOrders],
  );

  return (
    <div className="container mx-auto mt-28 p-2 text-white">
      <section className="shadow-form-shadow mb-10 rounded-2xl bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="ligature bg-gradient-to-r from-Sky to-Blue bg-clip-text text-2xl font-bold tracking-wide text-transparent">
            My Orders
          </h2>
        </div>
        {loading ? (
          <Loading />
        ) : orders.length > 0 ? (
          <>
            {pending.length > 0 && (
              <Section
                color="Yellow"
                items={pending}
                render={renderOrderCard}
                title="Pending Order"
              />
            )}
            {approved.length > 0 && (
              <Section
                color="Mint"
                items={approved}
                render={renderOrderCard}
                title="Approved Order"
              />
            )}
            {shipped.length > 0 && (
              <Section
                color="Sky"
                items={shipped}
                render={renderOrderCard}
                title="Shipped Order"
              />
            )}
            {canceled.length > 0 && (
              <Section
                color="Rose"
                items={canceled}
                render={renderOrderCard}
                title="Canceled Order"
              />
            )}
          </>
        ) : (
          <div className="py-20 text-center text-gray-400">
            <h3 className="text-xl font-semibold">No orders yet</h3>
            <p className="mt-2 text-sm">Start shopping and place your first order!</p>
          </div>
        )}
      </section>
      <MyModal
        additionalContent={
          selectedOrder && (
            <div className="space-y-6 text-white">
              <div className="text-center">
                <p className="break-all font-mono text-xl font-bold tracking-wide text-teal-400">
                  {selectedOrder.orderId}
                </p>
              </div>
              <DropdownSection
                maxHeight="max-h-44"
                title="📄 Rangkuman Pesanan"
              >
                <div className="space-y-6 px-4">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-gray-700">
                      <tr>
                        <td className="pb-2 text-gray-400">Tanggal:</td>
                        <td className="pb-2 text-right font-medium text-white">
                          {new Date(selectedOrder.orderDate).toLocaleString('id-ID', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-400">Status:</td>
                        <td className="py-2 text-right font-medium text-white">
                          {selectedOrder.status}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-400">Nota:</td>
                        <td className="py-2 text-right text-white">
                          {selectedOrder.notes || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-400">Metode Pembayaran:</td>
                        <td className="py-2 text-right font-medium text-white">
                          {selectedOrder.paymentDetails.method}
                        </td>
                      </tr>
                      <tr>
                        <td className="pt-3 text-gray-400">Total Harga:</td>
                        <td className="pt-3 text-right font-medium text-white">
                          {formatIDR(selectedOrder.paymentDetails.totalPrice)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {selectedOrder.paymentDetails.method === 'GoPay' && (
                    <div className="space-y-3 text-center">
                      <img
                        alt="GoPay QR Code"
                        className="mx-auto h-36 w-36 rounded-xl border border-gray-700 shadow-md"
                        src={Gopay}
                      />
                      <p className="text-sm text-gray-400">
                        Scan with GoPay app to pay{' '}
                        <span className="font-semibold text-white">
                          {formatIDR(selectedOrder.paymentDetails.totalPrice)}
                        </span>
                        .
                      </p>
                    </div>
                  )}
                  {selectedOrder.paymentDetails.method === 'OVO' && (
                    <div className="space-y-3 text-center">
                      <img
                        alt="OVO QR Code"
                        className="mx-auto h-36 w-36 rounded-xl border border-gray-700 shadow-md"
                        src={Gopay}
                      />
                      <p className="text-sm text-gray-400">
                        Scan with OVO app to pay{' '}
                        <span className="font-semibold text-white">
                          {formatIDR(selectedOrder.paymentDetails.totalPrice)}
                        </span>
                        .
                      </p>
                    </div>
                  )}
                  {selectedOrder.paymentDetails.method === 'Cash on Delivery' && (
                    <p className="text-center text-sm text-gray-400">
                      Please prepare{' '}
                      <span className="font-semibold text-white">
                        {formatIDR(selectedOrder.paymentDetails.totalPrice)}
                      </span>{' '}
                      upon delivery.
                    </p>
                  )}
                </div>
              </DropdownSection>
              <DropdownSection
                maxHeight="max-h-28"
                title="📚 Buku Pesanan"
              >
                <div className="space-y-4 rounded-2xl px-4 text-sm">
                  <ul className="space-y-3">
                    {selectedOrder.items.map((item, index) => {
                      const book = bookDetails[item.bookId];
                      return (
                        <li
                          key={index}
                          className="flex items-start justify-between border-b border-gray-700 pb-2"
                        >
                          <div className="w-3/4">
                            <p className="font-medium text-white">
                              {book ? Truncate(book.title, 30) : 'Loading...'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Jumlah: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-white">
                            {book ? formatIDR(book.price * item.quantity) : '...'}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </DropdownSection>
              <DropdownSection title="📦 Alamat Pengiriman">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="py-2 text-gray-400">Penerima:</td>
                      <td className="py-2 text-right font-medium text-white">
                        {selectedOrder.address.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-400">Telepon:</td>
                      <td className="py-2 text-right font-medium text-white">
                        {selectedOrder.address.phone}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-400">Alamat:</td>
                      <td className="py-2 text-right text-white">
                        {selectedOrder.address.address}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-400">Kota:</td>
                      <td className="py-2 text-right font-medium text-white">
                        {selectedOrder.address.city}
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-3 text-gray-400">Kode Pos:</td>
                      <td className="pt-3 text-right font-medium text-white">
                        {selectedOrder.address.postalCode}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </DropdownSection>
            </div>
          )
        }
        open={Boolean(selectedOrder)}
        size="lg"
        title="Detail Pesanan"
        onClose={handleCloseDetail}
      />
      <MyModal
        actionButtons={[
          {
            label: confirmModal.action === 'cancel' ? 'Yes, Cancel' : 'Yes, Delete',
            onClick: handleConfirmAction,
          },
          {
            label: 'No',
            onClick: closeConfirmModal,
          },
        ]}
        description={`Order ID: ${confirmModal.orderId}`}
        open={confirmModal.open}
        title={`${confirmModal.action} this order?`}
        onClose={closeConfirmModal}
      />
      <MySnackbar
        message={snackbar.message}
        open={snackbar.open}
        type={snackbar.type}
        onClose={handleAlertClose}
      />
    </div>
  );
};

const Section = ({ color, items, render, title }) => (
  <div className="mb-10">
    <h3
      className={`mb-4 flex flex-row items-center gap-2 text-lg font-semibold text-white`}
    >
      <FaCircle className={`text-${color}`} /> {title}
    </h3>
    <ul className="flex flex-col gap-6">{items.map(render)}</ul>
  </div>
);

export default Order;
