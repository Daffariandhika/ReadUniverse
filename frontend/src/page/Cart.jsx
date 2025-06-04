import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import AnimatedBook from '../components/AnimatedBook';
import AnimatedText from '../components/AnimatedText';
import ButtonPrimary from '../components/ButtonPrimary';
import CardProduct from '../components/CardProduct';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import Loading from '../loader/Loading';
import { Truncate } from '../utils/Truncate';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.cart) {
          setCartItems(response.data.cart);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err.response ? err.response.data.message : 'An error occurred.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (bookId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/cart/update`,
        { bookId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCartItems((prevItems) =>
        prevItems.map((book) =>
          book.bookId === bookId ? { ...book, quantity: newQuantity } : book,
        ),
      );

      setSnackbar({
        open: true,
        message: `Quantity updated successfully.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbar({
        open: true,
        message: `Failed to update quantity.`,
        severity: 'error',
      });
    }
  };

  const handleRemoveBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/remove`, {
        data: { bookId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prevItems) => prevItems.filter((book) => book.bookId !== bookId));

      setSnackbar({
        open: true,
        message: `Book removed successfully.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error removing book:', error);
      setSnackbar({
        open: true,
        message: `Failed to remove book.`,
        severity: 'error',
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found.');
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.cart) {
        setCartItems(response.data.cart);
        setShowConfirmation(true);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to fetch cart details.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while fetching cart details.',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleProceed = () => {
    const orderDetails = {
      items: cartItems,
      totalPrice: cartItems
        .reduce((total, book) => total + book.price * book.quantity, 0)
        .toFixed(2),
    };

    navigate('/checkout', { state: { orderDetails } });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const totalBooks = cartItems.reduce((total, book) => total + book.quantity, 0);
  const totalPrice = cartItems
    .reduce((total, book) => total + book.price * book.quantity, 0)
    .toFixed(2);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-xl font-bold text-red-600">{error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <AnimatedText Headline="Your Cart Is Empty" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 mt-16 text-center text-4xl font-bold text-White">Your Cart</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cartItems.map((book) => (
          <CardProduct
            key={book.bookId}
            className="cart-card bg-softWhite flex flex-col justify-between overflow-hidden rounded-lg border shadow-md transition-shadow hover:shadow-lg"
            height="344px"
            padding="16px"
            width="294px"
          >
            <AnimatedBook
              imageURL={book.imageURL}
              to={`/book/${book._id}`}
            />
            <div>
              <h3 className="ligature my-2 text-lg text-White">
                {Truncate(book.title, 20)}
              </h3>
              <p className="mb-4 font-bold text-White">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                }).format(book.price)}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    className="flex h-8 w-8 transform items-center justify-center rounded bg-Indigo text-lg font-bold text-White transition duration-700 hover:scale-105 hover:bg-Navy"
                    onClick={() =>
                      handleQuantityChange(book.bookId, Math.max(1, book.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-lg text-White">
                    {book.quantity}
                  </span>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded bg-Indigo text-lg font-bold text-White transition duration-700 hover:scale-105 hover:bg-Navy"
                    onClick={() => handleQuantityChange(book.bookId, book.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="hover:shadow-glow-red-thin flex h-8 w-8 items-center justify-center rounded bg-gradient-to-r from-rose-500 to-red-500 text-lg font-bold text-White transition duration-700"
                  onClick={() => handleRemoveBook(book.bookId)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </CardProduct>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="text-lg font-semibold text-White">
          <p>
            Total Books: <span className="text-White">{totalBooks}</span>
          </p>
          <p>
            Total Price:{' '}
            <span className="text-White">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(totalPrice)}
            </span>
          </p>
        </div>
        <ButtonPrimary onClick={handleCheckout}>Proceed to Checkout</ButtonPrimary>
      </div>
      <MyModal
        actionButtons={[
          {
            label: 'Cancel',
            onClick: handleCancel,
          },
          {
            label: 'Proceed',
            onClick: handleProceed,
          },
        ]}
        additionalContent={
          <div className="space-y-4 rounded-xl bg-Indigo p-5 shadow-lg">
            <div>
              <div className="scrollbar-thin scrollbar-thumb scrollbar-track bg-Black/90 max-h-[194px] overflow-y-auto rounded-lg p-2 shadow-inner transition-all duration-300 ease-in-out">
                <ul className="space-y-3 text-sm text-White">
                  {cartItems.map((book) => (
                    <li
                      key={book.bookId}
                      className="flex items-start gap-4 border-b border-gray-700 pb-3 last:border-none"
                    >
                      <img
                        alt={book.title}
                        className="h-20 w-16 shrink-0 rounded-md object-fill shadow-sm"
                        src={book.imageURL}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold">
                          {Truncate(book.title, 30)}
                        </p>
                        <p className="text-xs font-medium text-Gray">
                          Quantity: {book.quantity}
                        </p>
                        <p className="bg-gradient-to-r from-Sky via-Blue to-Purple bg-clip-text text-sm font-bold text-transparent">
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          }).format(book.price * book.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-2 rounded-xl bg-Darkness p-4 text-sm text-white shadow-inner">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Items :</span>
                <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Price :</span>
                <span>
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  }).format(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        }
        modalClassName="p-6"
        open={showConfirmation}
        size="md"
        title="Confirm Your Order"
        onClose={handleCancel}
      />

      <MySnackbar
        message={snackbar.message}
        open={snackbar.open}
        type={snackbar.severity}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default Cart;
