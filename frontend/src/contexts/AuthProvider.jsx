import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from './AuthContext';
import { syncWithMongoDB } from './authUtils';
import app from '../firebase/firebase.config';

const auth = getAuth(app);
const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkTokenExpiration = useCallback(async () => {
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdTokenResult();
        const decodedToken = jwtDecode(token.token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.warn('Token has expired, logging out...');
          await signOut();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    }
  }, [signOut]);

  const checkAdminStatus = async () => {
    if (auth.currentUser) {
      try {
        const idTokenResult = await auth.currentUser.getIdTokenResult(true);
        setIsAdmin(!!idTokenResult.claims.admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    } else {
      setIsAdmin(false);
    }
  };

  const createUser = useCallback(
    async (email, password, username) => {
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const firebaseUser = userCredential.user;

        await updateProfile(firebaseUser, { displayName: username });

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username,
          password,
        };

        await syncWithMongoDB(userData, API_BASE_URL);
        await signOut();
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [signOut],
  );

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      await checkAdminStatus();
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfileDetails = async (profileUpdates) => {
    if (!auth.currentUser) throw new Error('No user is currently signed in');
    try {
      await updateProfile(auth.currentUser, profileUpdates);
      setUser({ ...auth.currentUser, ...profileUpdates });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser) throw new Error('No user is currently signed in');
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        await checkAdminStatus();
      }
    });

    const tokenCheckInterval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(tokenCheckInterval);
    };
  }, [checkTokenExpiration]);

  const authInfo = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      createUser,
      signIn,
      signOut,
      updateProfileDetails,
      changePassword,
    }),
    [user, loading, isAdmin, createUser, signIn, signOut],
  );

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
