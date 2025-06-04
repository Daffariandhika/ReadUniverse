import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { FaStar } from 'react-icons/fa';

import Logo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: '',
    productId: '',
    rating: 0,
    comment: '',
  });

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setSnackbarMessage('Error fetching books. Please try again later.');
        setSnackbarType('error');
        setSnackbarOpen(true);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: user.displayName || '',
          email: user.email || '',
        }));
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filteredResults = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(filteredResults);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleResultClick = (bookTitle, bookId) => {
    setFormData({
      ...formData,
      product: bookTitle,
      productId: bookId,
    });
    setSearchQuery(bookTitle);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'rating' ? parseInt(value) : value;
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-GB').format(date);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setSnackbarMessage('You need to be logged in to submit feedback.');
      setSnackbarType('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const formDataWithDate = {
      ...formData,
      date: formattedDate,
      productId: formData.productId,
    };

    if (!formData.product || !formData.comment || formData.rating === 0) {
      setSnackbarMessage('Please fill all the fields before submitting.');
      setSnackbarType('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${user.uid}/add-review`,
        {
          review: formDataWithDate,
        },
      );

      setModalMessage(response.data.message || 'Feedback submitted successfully!');
      setModalType('Success, Your feedback has been posted!');

      setFormData({
        name: formData.name,
        email: formData.email,
        product: '',
        rating: 0,
        comment: '',
      });
      setSearchQuery('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setModalMessage('An error occurred while submitting feedback. Please try again.');
      setModalType('Error, While submitting seedback, Please try again');
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  };

  const isFormIncomplete =
    !formData.product || !formData.comment || formData.rating === 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-Darkness pb-8 pt-12 text-white">
      <MyDecoration />
      <div className="relative z-10 grid h-full md:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-10">
          <h1 className="flex items-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text font-sans text-4xl font-bold text-transparent">
            <img
              alt="ReadUniverse Logo"
              className="mr-2 h-12 w-12"
              src={Logo}
            />
            ReadUniverse
          </h1>
          <p className="my-1 mb-2 text-center text-white">
            Share your feedback about our products.
          </p>
          <ButtonPrimary to="/">Home</ButtonPrimary>
        </div>
        <div className="flex items-center justify-center px-6">
          <form
            className="w-full max-w-md rounded-2xl bg-Darkness bg-opacity-90 p-6"
            onSubmit={handleSubmit}
          >
            <h1
              className="text-2xl font-bold"
              id="contact-us-form"
            >
              Share Your Feedback
            </h1>
            <p className="mb-4 text-sm tracking-wide">
              Let the other see your experience.
            </p>
            <div className="flex flex-col">
              <MyInput
                disabled
                readOnly
                autoComplete="off"
                name="name"
                placeholder="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              <MyInput
                disabled
                readOnly
                autoComplete="off"
                name="email"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6 flex items-center">
              <span className="mr-2 text-gray-200">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < formData.rating ? 'text-amber-400' : 'text-TransparentWhite'
                  } mx-1 transform cursor-pointer transition-transform duration-200 hover:scale-125`}
                  size={24}
                  onClick={() => handleRatingChange(i + 1)}
                />
              ))}
            </div>
            <div className="relative mb-6">
              <input
                autoComplete="off"
                className="w-full rounded-2xl border-2 border-Indigo bg-Darkness px-4 py-3 text-gray-200 transition duration-200 ease-in-out focus:border-Indigo focus:outline-none focus:ring-0"
                id="search"
                name="search"
                placeholder="Select product"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg bg-black text-gray-200 shadow-lg"
                >
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-800"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleResultClick(result.title, result._id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleResultClick(result.title, result._id);
                        }
                      }}
                    >
                      {result.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <textarea
              required
              className="mb-4 w-[400px] resize-none rounded-2xl border-2 border-Indigo bg-Darkness py-3 text-gray-200 focus:border-Indigo focus:outline-none focus:ring-0"
              name="comment"
              placeholder="Feedback"
              rows="4"
              value={formData.comment}
              onChange={handleChange}
            ></textarea>
            <ButtonPrimary
              disabled={loading || isFormIncomplete}
              type="submit"
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
            </ButtonPrimary>
          </form>
        </div>
        <MyModal
          description={modalMessage}
          open={modalOpen}
          title={modalType}
          onClose={() => setModalOpen(false)}
        />
        <MySnackbar
          message={snackbarMessage}
          open={snackbarOpen}
          type={snackbarType}
          onClose={() => setSnackbarOpen(false)}
        />
      </div>
    </div>
  );
};

export default FeedbackForm;
