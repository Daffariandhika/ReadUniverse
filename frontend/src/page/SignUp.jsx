import { Visibility, VisibilityOff } from '@mui/icons-material';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';
import { useCallback, useReducer } from 'react';
import { FaBookOpen, FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import { useAuth } from '../contexts/AuthContext';
import useDebounce from '../hooks/useDebounce';

const initialState = {
  formData: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  visibility: {
    password: false,
    confirmPassword: false,
  },
  loading: false,
  success: false,
  error: null,
  fieldErrors: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  passwordStrength: '',
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case 'SET_VISIBILITY':
      return {
        ...state,
        visibility: {
          ...state.visibility,
          [action.field]: !state.visibility[action.field],
        },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.value };
    case 'SET_FIELD_ERROR':
      return {
        ...state,
        fieldErrors: { ...state.fieldErrors, [action.field]: action.value },
      };
    case 'SET_PASSWORD_STRENGTH':
      return { ...state, passwordStrength: action.value };
    case 'SET_SUCCESS':
      return { ...state, success: action.value };
    default:
      return state;
  }
};

const SignUp = () => {
  const { createUser } = useAuth();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { error, fieldErrors, formData, loading, passwordStrength, success, visibility } =
    state;
  const navigate = useNavigate();
  const calculatePasswordStrengthAndValidate = (password) => {
    const criteria = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*]/.test(password),
    ];

    const strengthScore = criteria.filter(Boolean).length;
    const strengthLabels = ['Weak', 'Fragile', 'Stable', 'Secure', 'Strong'];
    const passwordStrength = strengthLabels[strengthScore];

    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters.');
    if (!/[A-Z]/.test(password)) errors.push('Include an uppercase letter.');
    if (!/[a-z]/.test(password)) errors.push('Include a lowercase letter.');
    if (!/[0-9]/.test(password)) errors.push('Include a number.');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Include a special character.');

    return { passwordStrength, errors };
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: 'SET_FIELD', field: name, value });

    if (name === 'password') {
      const { errors, passwordStrength } = calculatePasswordStrengthAndValidate(value);
      dispatch({ type: 'SET_PASSWORD_STRENGTH', value: passwordStrength });
      dispatch({
        type: 'SET_FIELD_ERROR',
        field: 'password',
        value: errors.join(' '),
      });

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: 'confirmPassword',
          value: 'Passwords do not match.',
        });
      } else {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: 'confirmPassword',
          value: '',
        });
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: 'confirmPassword',
          value: 'Passwords do not match.',
        });
      } else {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: 'confirmPassword',
          value: '',
        });
      }
    }
  };

  const validateInput = useCallback(async (field, value) => {
    if (field === 'username' && value.trim().length < 3) {
      dispatch({
        type: 'SET_FIELD_ERROR',
        field: 'username',
        value: 'Username must be at least 3 characters long.',
      });
      return;
    }

    if (field === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      dispatch({
        type: 'SET_FIELD_ERROR',
        field: 'email',
        value: 'Invalid email format.',
      });
      return;
    }

    const payload = field === 'username' ? { username: value } : { email: value };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/availability-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field,
          value: data.errors?.[field] || 'Validation failed.',
        });
      } else {
        dispatch({ type: 'SET_FIELD_ERROR', field, value: '' });
      }
    } catch (error) {
      dispatch({
        type: 'SET_FIELD_ERROR',
        field,
        value: 'Network error. Please try again.',
      });
    }
  }, []);

  useDebounce(formData.username, 500, (debouncedUsername) => {
    if (debouncedUsername.trim()) {
      validateInput('username', debouncedUsername);
    }
  });

  useDebounce(formData.email, 500, (debouncedEmail) => {
    if (debouncedEmail.trim()) {
      validateInput('email', debouncedEmail);
    }
  });

  const toggleVisibility = (field) => {
    dispatch({ type: 'SET_VISIBILITY', field });
  };

  const checkEmailExistence = async (email) => {
    try {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        dispatch({
          type: 'SET_FIELD_ERROR',
          field: 'email',
          value: 'Email is already registered.',
        });
        return true;
      }
      return false;
    } catch {
      dispatch({ type: 'SET_ERROR', value: 'Error validating email.' });
      return false;
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { confirmPassword, email, password, username } = formData;

    if (Object.values(fieldErrors).some((error) => error)) {
      dispatch({
        type: 'SET_ERROR',
        value: 'Please fix the highlighted errors before submitting.',
      });
      return;
    }

    const errors = {};

    if (await checkEmailExistence(email)) {
      errors.email = 'Email is already registered.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((field) =>
        dispatch({ type: 'SET_FIELD_ERROR', field, value: errors[field] }),
      );
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', value: true });
      await createUser(email, password, username);
      dispatch({ type: 'SET_SUCCESS', value: true });

      dispatch({ type: 'SET_FIELD', field: 'username', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'email', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'password', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: '' });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        value: error.message || 'Sign-up error, Please Try Again.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
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
            className="w-full max-w-md rounded-2xl bg-Darkness bg-opacity-90 p-6"
            disabled={loading}
            onSubmit={handleSignUp}
          >
            <h1 className="mb-1 text-2xl font-bold">Create Account</h1>
            <p className="mb-4 text-sm">Sign up to explore</p>
            <MyInput
              required
              disabled={loading}
              errorMessage={fieldErrors.username}
              hasError={Boolean(fieldErrors.username)}
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <MyInput
              required
              disabled={loading}
              errorMessage={fieldErrors.email}
              hasError={Boolean(fieldErrors.email)}
              name="email"
              placeholder="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <MyInput
              required
              disabled={loading}
              errorMessage={fieldErrors.password}
              hasError={Boolean(fieldErrors.password)}
              icon={
                visibility.password ? (
                  <VisibilityOff onClick={() => toggleVisibility('password')} />
                ) : (
                  <Visibility onClick={() => toggleVisibility('password')} />
                )
              }
              name="password"
              placeholder="Password"
              strengthColor={
                passwordStrength === 'Strong'
                  ? 'text-green-500'
                  : passwordStrength === 'Secure'
                    ? 'text-blue-500'
                    : passwordStrength === 'Stable'
                      ? 'text-yellow-500'
                      : passwordStrength === 'Fragile'
                        ? 'text-orange-500'
                        : passwordStrength === 'Weak'
                          ? 'text-red-500'
                          : ''
              }
              strengthMessage={passwordStrength ? `${passwordStrength}` : ''}
              type={visibility.password ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
            />
            <MyInput
              required
              disabled={loading}
              errorMessage={fieldErrors.confirmPassword}
              hasError={Boolean(fieldErrors.confirmPassword)}
              icon={
                visibility.confirmPassword ? (
                  <VisibilityOff onClick={() => toggleVisibility('confirmPassword')} />
                ) : (
                  <Visibility onClick={() => toggleVisibility('confirmPassword')} />
                )
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              type={visibility.confirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <ButtonPrimary
              disabled={loading}
              icon={FaUserPlus}
              isLoading={loading}
              type="submit"
            >
              Sign Up
            </ButtonPrimary>
            <Link
              className="mt-3 block text-sm text-blue-500 transition duration-200 hover:underline"
              to="/sign-in"
            >
              Already have an account? Sign In
            </Link>
          </form>
        </div>
        <MySnackbar
          message={error}
          open={Boolean(error)}
          type="error"
          onClose={() => dispatch({ type: 'SET_ERROR', value: null })}
        />
        <MyModal
          actionButtons={[
            {
              label: 'Sign In',
              onClick: () => {
                dispatch({ type: 'SET_SUCCESS', value: false });
                navigate('/sign-in');
              },
            },
          ]}
          description="Your account has been created. You can now sign in to explore and purchase books!"
          open={success}
          title="Account Created Successfully"
          onClose={() => dispatch({ type: 'SET_SUCCESS', value: false })}
        />
      </div>
    </div>
  );
};

export default SignUp;
