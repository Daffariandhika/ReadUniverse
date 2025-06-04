import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Gopay from '../assets/Image/gopay.png';
import ButtonPrimary from '../components/ButtonPrimary';
import DropdownSection from '../components/DropdownSection';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import { Truncate } from '../utils/Truncate';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const shippingCost = 10000;
  const serviceFeeRate = 0.05;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found.');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { cart } = response.data || {};
        setCartItems(cart || []);
        setTotalPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'An error occurred.',
          severity: 'error',
        });
      }
    };
    fetchCartItems();
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'phone' || name === 'postalCode') && !/^\d*$/.test(value)) {
      return;
    }

    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const formatIDR = (amount) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const paymentOptions = [
    { name: 'GoPay', icon: '../src/assets/Image/gopaylogo.png' },
    { name: 'OVO', icon: '../src/assets/Image/ovo.png' },
    { name: 'Cash on Delivery', icon: '../src/assets/Image/cod.png' },
  ];

  const handleCreateReceipt = () => {
    if (!paymentMethod || Object.values(newAddress).some((field) => !field)) {
      setSnackbar({
        open: true,
        message: !paymentMethod
          ? 'Please select a payment method.'
          : 'Please fill in all address fields.',
        severity: 'info',
      });
      return;
    }
    setShowConfirmation(true);
  };

  const handleProceed = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found.');

      const newOrder = {
        address: newAddress,
        paymentDetails: {
          method: paymentMethod,
          totalPrice: totalWithFees,
        },
        notes: note,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/add`,
        newOrder,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success',
        });
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || 'Failed to place the order.',
        severity: 'error',
      });
      console.error('Order placement error:', err.response || err);
    } finally {
      setShowConfirmation(false);
    }
  };

  const totalWithFees = totalPrice + shippingCost + totalPrice * serviceFeeRate;

  if (!cartItems.length) {
    return (
      <div className="py-10 text-center text-gray-600">
        No items to checkout. Please add items to your cart.
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="ligature mb-6 text-center text-4xl font-bold text-White">
        Checkout
      </h1>
      <section className="shadow-form-shadow mb-10 rounded-2xl bg-[#0A0A0A] p-6 md:p-8">
        <h2 className="ligature mb-6 bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-2xl font-semibold tracking-wider text-transparent">
          Order Summary
        </h2>
        <ul className="mb-8 space-y-6">
          {cartItems.map((item) => (
            <li
              key={item.bookId}
              className="flex flex-col gap-4 rounded-xl bg-[#141414] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex gap-4">
                <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
                  <img
                    alt={item.title}
                    className="h-full w-full rounded-md object-fill"
                    src={item.imageURL}
                  />
                  <div className="absolute inset-0 rounded-md" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-lg font-semibold text-White">{item.title}</p>
                  <p className="mt-1 text-sm text-Gray">
                    Quantity: <span>{item.quantity}</span>
                  </p>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <p className="text-lg font-bold text-White">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(item.price * item.quantity)}
                </p>
                <p className="mt-1 text-sm text-Gray">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(item.price)}{' '}
                  × {item.quantity}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between rounded-xl bg-Darkness p-5">
          <span className="ligature bg-gradient-to-r from-Sky to-Blue bg-clip-text text-2xl font-semibold tracking-wide text-transparent">
            Total Price:
          </span>
          <span className="bg-gradient-to-l from-Sky to-Blue bg-clip-text text-2xl font-extrabold tracking-wider text-transparent">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            }).format(totalPrice)}
          </span>
        </div>
      </section>
      <section className="shadow-form-shadow mb-8 rounded-xl bg-[#0A0A0A] p-6 md:p-8">
        <h2 className="ligature mb-6 bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-2xl font-semibold tracking-wide text-transparent">
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              label: 'Name',
              name: 'name',
            },
            {
              label: 'Phone',
              name: 'phone',
            },
            {
              label: 'Address',
              name: 'address',
              fullWidth: true,
            },
            {
              label: 'City',
              name: 'city',
            },
            {
              label: 'Postal Code',
              name: 'postalCode',
            },
          ].map(({ fullWidth, label, name, type }) => (
            <div
              key={name}
              className={fullWidth ? 'md:col-span-2' : ''}
            >
              <label className="mb-2 block text-lg font-semibold tracking-wide text-White">
                {label}
              </label>
              <input
                className="w-full rounded-lg border-none bg-[#141414] py-4 pl-5 text-White outline-none focus:ring-0"
                name={name}
                placeholder={label}
                type={type || 'text'}
                value={newAddress[name]}
                onChange={handleAddressChange}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="shadow-form-shadow mb-8 rounded-xl bg-[#0A0A0A] p-6 md:p-8">
        <h2 className="ligature mb-4 bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-2xl font-semibold tracking-wide text-transparent">
          Leave a Note
        </h2>
        <textarea
          className="w-full resize-none rounded-lg border-none bg-[#141414] py-4 pl-5 text-White outline-none focus:ring-0"
          name="note"
          placeholder="Add any special instructions or messages..."
          rows={6}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </section>
      <section className="shadow-form-shadow mb-8 rounded-xl bg-[#0A0A0A] p-6 md:p-8">
        <h2 className="ligature mb-6 bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-2xl font-semibold tracking-wide text-transparent">
          Payment Method
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {paymentOptions.map((method) => (
            <motion.label
              key={method.name}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border px-4 py-5 shadow-sm transition-all duration-200 ${
                paymentMethod === method.name
                  ? 'border-Darkness bg-Darkness text-Sky ring-2 ring-Darkness'
                  : 'border-2 border-[#0A0A0A] text-White hover:shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                checked={paymentMethod === method.name}
                className="hidden"
                name="payment"
                type="radio"
                value={method.name}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <img
                alt={method.name}
                className="h-20 w-20 object-contain transition-transform duration-300"
                src={method.icon}
              />
              <span className="text-center text-lg font-semibold tracking-wide">
                {method.name}
              </span>
            </motion.label>
          ))}
        </div>
      </section>
      <div className="flex justify-end space-x-6">
        <ButtonPrimary onClick={() => navigate('/cart')}>Go Back to Cart</ButtonPrimary>
        <ButtonPrimary onClick={handleCreateReceipt}>Create Receipt</ButtonPrimary>
      </div>
      <MyModal
        actionButtons={[
          {
            label: 'Cancel',
            onClick: () => setShowConfirmation(false),
          },
          {
            label: 'Confirm',
            onClick: handleProceed,
          },
        ]}
        additionalContent={
          <div className="space-y-6 text-white">
            <DropdownSection title="📦 Shipping Address">
              <div className="space-y-2 rounded-2xl px-4 text-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="font-medium">{newAddress.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium">{newAddress.phone || '-'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-400">Address</p>
                    <p className="font-medium">{newAddress.address || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">City</p>
                    <p className="font-medium">{newAddress.city || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Postal Code</p>
                    <p className="font-medium">{newAddress.postalCode || '-'}</p>
                  </div>
                </div>
              </div>
            </DropdownSection>
            <DropdownSection
              maxHeight="max-h-44"
              title="💳 Payment Details"
            >
              <div className="space-y-4 rounded-2xl px-4 text-sm">
                <table className="w-full text-gray-300">
                  <tbody className="divide-y divide-gray-700">
                    {[
                      { label: 'Subtotal', value: totalPrice },
                      { label: 'Shipping', value: shippingCost },
                      {
                        label: 'Service Fee (5%)',
                        value: totalPrice * serviceFeeRate,
                      },
                    ].map(({ label, value }) => (
                      <tr key={label}>
                        <td className="py-2">{label}</td>
                        <td className="py-2 text-right text-white">{formatIDR(value)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-gray-600 text-base font-semibold text-white">
                      <td>Total</td>
                      <td className="py-2 text-right">{formatIDR(totalWithFees)}</td>
                    </tr>
                    <tr>
                      <td className="pt-2 text-gray-400">Payment Method</td>
                      <td className="pt-2 text-right text-white">{paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>
                {paymentMethod === 'GoPay' && (
                  <div className="space-y-3 pt-4 text-center">
                    <img
                      alt="GoPay QR Code"
                      className="mx-auto h-40 w-40 rounded-xl border border-gray-700 shadow-md"
                      src={Gopay}
                    />
                    <p className="text-sm text-gray-400">
                      Scan this QR Code using your GoPay app to complete the payment of{' '}
                      <span className="font-semibold text-white">
                        {formatIDR(totalWithFees)}
                      </span>
                      .
                    </p>
                  </div>
                )}
                {paymentMethod === 'OVO' && (
                  <div className="space-y-3 pt-4 text-center">
                    <img
                      alt="OVO QR Code"
                      className="mx-auto h-40 w-40 rounded-xl border border-gray-700 shadow-md"
                      src={Gopay}
                    />
                    <p className="text-sm text-gray-400">
                      Scan this QR Code using your OVO app to complete the payment of{' '}
                      <span className="font-semibold text-white">
                        {formatIDR(totalWithFees)}
                      </span>
                      .
                    </p>
                  </div>
                )}
                {paymentMethod === 'Cash on Delivery' && (
                  <p className="pt-2 text-sm text-gray-400">
                    Your order will be processed. Please prepare{' '}
                    <span className="font-semibold text-white">
                      {formatIDR(totalWithFees)}
                    </span>{' '}
                    upon delivery.
                  </p>
                )}
              </div>
            </DropdownSection>
            <DropdownSection
              maxHeight="max-h-28"
              title="📚 Ordered Items"
            >
              <div className="space-y-4 rounded-2xl px-4 text-sm">
                <ul className="space-y-3 pr-1">
                  {cartItems.map((item) => (
                    <li
                      key={item.bookId}
                      className="flex items-start justify-between border-b border-gray-700 pb-2"
                    >
                      <div className="w-3/4">
                        <p className="font-medium text-white">
                          {Truncate(item.title, 30)}
                        </p>
                        <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-white">
                        {formatIDR(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </DropdownSection>
          </div>
        }
        modalClassName="p-6"
        open={showConfirmation}
        size="md"
        title="Order Summary"
        onClose={() => setShowConfirmation(false)}
      />
      <MySnackbar
        message={snackbar.message}
        open={snackbar.open}
        type={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </div>
  );
};

export default Checkout;
