import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS } from '../config/collections';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, resetPassword, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  // Ensure a Firestore user document exists with all fields the app expects
  async function ensureUserDoc(user) {
    if (!user) return;
    try {
      const userRef = doc(db, COLLECTIONS.USERS, user.uid);
      const snap = await getDoc(userRef);
      // Fields matching app's UserModel exactly
      const appFields = {
        name: user.displayName || '',
        email: user.email || '',
        phoneNumber: '',
        state: '',
        field: '',
        rank: '',
        exam: '',
        dob: '',
        interest: '',
        profileImageUrl: user.photoURL || '',
      };
      if (!snap.exists()) {
        // First-time user — create doc with all app-required fields
        await setDoc(userRef, appFields);
      } else {
        // Existing user — fill only missing fields
        const data = snap.data();
        const updates = {};
        for (const [key, defaultVal] of Object.entries(appFields)) {
          if (data[key] === undefined) {
            // Copy from legacy web field names if available
            if (key === 'state' && data.homeState) updates[key] = data.homeState;
            else if (key === 'field' && data.category) updates[key] = data.category;
            else if (key === 'rank' && data.crlRank) updates[key] = data.crlRank;
            else updates[key] = defaultVal;
          }
        }
        if (Object.keys(updates).length > 0) {
          await setDoc(userRef, updates, { merge: true });
        }
      }
    } catch (err) {
      console.error('Error ensuring user doc:', err);
    }
  }

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/my-courses');
    }
  }, [currentUser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      const cleanEmail = email.trim(); // Ensure no trailing spaces
      
      if (isForgotPassword) {
        if (!cleanEmail) {
          setError('Please enter your email address.');
          setLoading(false);
          return;
        }
        await resetPassword(cleanEmail);
        setMessage('Check your inbox for further instructions.');
      } else if (isLogin) {
        const cred = await login(cleanEmail, password);
        await ensureUserDoc(cred.user);
        navigate('/my-courses');
      } else {
        const cred = await signup(cleanEmail, password);
        await ensureUserDoc(cred.user);
        navigate('/my-courses');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(isForgotPassword ? 'Failed to reset password. Please verify the email.' : 'Authentication failed. Please try again.');
      }
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setMessage('');
      setLoading(true);
      const cred = await loginWithGoogle();
      await ensureUserDoc(cred.user);
      navigate('/my-courses');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError('Failed to sign in with Google.');
      }
    }
    setLoading(false);
  }
  
  // If currentUser exists but hasn't redirected yet, show loading
  if (currentUser) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="/logo-light.png" alt="Udaan Vidyapeeth" className="h-9 object-contain" />
            </Link>
            <Link to="/" className="text-gray-500 hover:text-brand-blue text-sm font-medium transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-heading">
              {isForgotPassword ? 'Reset password' : isLogin ? 'Sign in to your account' : 'Create an account'}
            </h2>
          </div>
          
          {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center border border-red-100">{error}</div>}
          {message && <div className="bg-green-50 text-green-600 p-3 rounded text-sm text-center border border-green-100">{message}</div>}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              {!isForgotPassword && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="sr-only">Password</label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {isLogin && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); }}
                        className="text-xs text-brand-blue hover:text-brand-dark font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition disabled:opacity-50"
              >
                {loading ? (isForgotPassword ? 'Sending...' : 'Authenticating...') : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up'))}
              </button>
            </div>
            
            <div className="text-center mt-4 space-y-2">
              {isForgotPassword ? (
                <button 
                  type="button" 
                  className="font-medium text-brand-blue hover:text-brand-dark text-sm"
                  onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(''); setMessage(''); }}
                >
                  Back to Sign In
                </button>
              ) : (
                <button 
                  type="button" 
                  className="font-medium text-brand-blue hover:text-brand-dark text-sm"
                  onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
                >
                  {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              )}
            </div>
          </form>

          {/* Google Sign In Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 transition"
              >
                {/* Google Logo SVG */}
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
