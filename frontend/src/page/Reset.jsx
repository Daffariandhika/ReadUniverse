import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MyModal from '../components/MyModal';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: '',
    description: '',
    success: false,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const debounceTimeout = setTimeout(() => validateEmail(value), 300);
    return () => clearTimeout(debounceTimeout);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setModalInfo({
        open: true,
        title: 'Success!',
        description: 'A password reset email has been sent. Please check your email.',
        success: true,
      });
      setEmail('');
    } catch (error) {
      let errorMessage = 'An error occurred. Please try again later.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email format is invalid.';
      }

      setModalInfo({
        open: true,
        title: 'Error',
        description: errorMessage,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, open: false });
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradientCosmic text-white">
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
            Discover a universe of high quality books.
          </p>
          <ButtonPrimary>Learn More</ButtonPrimary>
        </div>
        <div className="flex items-center justify-center px-6">
          <form
            aria-labelledby="forgot-password-form"
            className="w-full max-w-md rounded-2xl bg-Darkness bg-opacity-90 p-6"
            onSubmit={handleResetPassword}
          >
            <h1
              className="mb-2 text-center text-2xl font-bold"
              id="forgot-password-form"
            >
              Forgot Password
            </h1>
            <p className="mb-4 text-center text-sm">
              Enter your email address to reset your password.
            </p>
            <MyInput
              required
              aria-label="Email Address"
              disabled={isLoading}
              errorMessage={emailError}
              hasError={!!emailError}
              name="email"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <ButtonPrimary
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              {isLoading ? (
                <span>
                  <i className="fa fa-spinner fa-spin mr-2"></i> Sending...
                </span>
              ) : (
                'Reset Password'
              )}
            </ButtonPrimary>
            <Link
              className="mt-3 block text-center text-sm text-blue-500 transition duration-200 hover:underline"
              to="/sign-in"
            >
              Remember your password? Sign In
            </Link>
          </form>
        </div>
      </div>
      <MyModal
        actionButtons={[
          {
            label: 'Close',
            onClick: handleCloseModal,
          },
        ]}
        aria-live="assertive"
        description={modalInfo.description}
        open={modalInfo.open}
        title={modalInfo.title}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ForgotPassword;
