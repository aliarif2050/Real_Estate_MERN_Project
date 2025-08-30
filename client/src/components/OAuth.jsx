import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // <-- Replace your existing handleGoogleClick with this one
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Send user info to backend
      const res = await fetch(`${VITE_API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        }),
        credentials: 'include' // Ensure backend sets cookie properly
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 hover:bg-red-600'
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
