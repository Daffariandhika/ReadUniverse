import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { FaBookOpen, FaKey } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Logo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const { signIn, signOut, user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState({ error: null, success: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmSwitchModal, setConfirmSwitchModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const clearSession = async () => {
    localStorage.removeItem('token');
    signOut();
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setStatus({ error: null, success: false });
    setIsLoading(true);

    if (localStorage.getItem('token')) {
      setConfirmSwitchModal(true);
      setIsLoading(false);
      return;
    }

    await processSignIn();
  };

  const processSignIn = async () => {
    try {
      const { email, password, username } = formData;

      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/check-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username }),
      });
      const userResult = await userResponse.json();

      if (!userResponse.ok || !userResult.exists) {
        throw new Error('Invalid Credentials, Please Try Again');
      }

      await signIn(email, password);

      const passwordResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/update-password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      );
      const passwordResult = await passwordResponse.json();

      if (!passwordResponse.ok) {
        throw new Error(passwordResult.message || 'Failed to update password.');
      }

      localStorage.setItem('token', passwordResult.token);
      setStatus({ error: null, success: true });
    } catch (err) {
      setStatus({
        error: err.message || 'Unexpected error occurred. Please try again.',
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradientCosmic text-white">
      <MyDecoration />
      <div className="relative z-10 grid h-full md:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-10">
          <h1 className="flex items-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text font-sans text-4xl font-bold text-transparent">
            <img
              alt="icon"
              className="mr-2 h-12 w-12"
              src={Logo}
            />
            ReadUniverse
          </h1>
          <p className="my-1 mb-2 text-white">
            The place where you can find the best book quality
          </p>
          <ButtonPrimary icon={FaBookOpen}>Read More</ButtonPrimary>
        </div>
        <div className="flex items-center justify-center">
          <form
            autoComplete="off"
            className="w-full max-w-md rounded-2xl bg-Darkness bg-opacity-90 p-6"
            onSubmit={handleSignIn}
          >
            <h1 className="mb-1 text-2xl font-bold text-White">Hello Again!</h1>
            <p className="mb-4 text-sm font-normal text-White">Welcome Back</p>
            <MyInput
              required
              aria-label="Enter your username"
              disabled={isLoading}
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <MyInput
              required
              aria-label="Enter your email address"
              disabled={isLoading}
              name="email"
              placeholder="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <MyInput
              required
              aria-label="Enter your password"
              disabled={isLoading}
              icon={
                showPassword ? (
                  <VisibilityOff onClick={togglePasswordVisibility} />
                ) : (
                  <Visibility onClick={togglePasswordVisibility} />
                )
              }
              name="password"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
            <ButtonPrimary
              icon={FaKey}
              isLoading={isLoading}
              type="submit"
            >
              {isLoading ? 'Logging In...' : 'Login'}
            </ButtonPrimary>
            <div className="mt-3 flex justify-between">
              <Link
                className="text-sm text-blue-500 hover:underline"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
              <Link
                className="text-sm text-blue-500 hover:underline"
                to="/sign-up"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <MySnackbar
        aria-live="polite"
        message={status.error}
        open={Boolean(status.error)}
        type="error"
        onClose={() => setStatus((prev) => ({ ...prev, error: null }))}
      />
      <MyModal
        actionButtons={[
          {
            label: 'Go to Home',
            onClick: () => navigate(from, { replace: true }),
          },
        ]}
        description={`You have successfully signed in as ${user?.displayName || user?.email}.`}
        open={status.success}
        size="sm"
        title="Welcome!"
        onClose={() => setStatus((prev) => ({ ...prev, success: false }))}
      />
      <MyModal
        actionButtons={[
          {
            label: 'Cancel',
            onClick: () => setConfirmSwitchModal(false),
          },
          {
            label: 'Proceed',
            onClick: async () => {
              setConfirmSwitchModal(false);
              await clearSession();
              await processSignIn();
            },
          },
        ]}
        description={`You are currently logged in as ${user?.displayName || user?.email}. Do you want to log out and log in with a different account?`}
        open={confirmSwitchModal}
        size="sm"
        title="Switch Account"
        onClose={() => setConfirmSwitchModal(false)}
      />
    </div>
  );
};

export default SignIn;
