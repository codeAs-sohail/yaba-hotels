import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApi';
import { setTokens } from '../features/auth/authSlice';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.auth);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      const data = await login({ email: email.trim(), password }).unwrap();
      if (data && data.access) {
        dispatch(setTokens({ access: data.access, refresh: data.refresh }));
        navigate('/owner', { replace: true });
      } else {
        setErrorMessage('Authentication succeeded but tokens were missing.');
      }
    } catch (err) {
      if (err?.data?.detail) {
        setErrorMessage(err.data.detail);
      } else if (err?.data?.non_field_errors) {
        setErrorMessage(err.data.non_field_errors.join(' '));
      } else if (err?.status === 401) {
        setErrorMessage('Invalid email or password. Please verify your credentials.');
      } else if (err?.error) {
        setErrorMessage(err.error);
      } else {
        setErrorMessage('Unable to connect to the authentication server. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_14px_35px_rgba(41,33,28,0.12)] border border-[#29211C]/8 p-8 sm:p-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#E85D16] to-[#B94720] shadow-[0_4px_12px_rgba(232,93,22,0.25)] text-white mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29211C] tracking-tight">
            Owner Portal
          </h2>
          <p className="font-sans text-sm text-[#766D65] mt-1.5">
            Sign in to access the Yaba Hotels management dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-fade-in"
            role="alert"
          >
            <svg
              className="h-5 w-5 text-red-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="owner-email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#29211C] mb-2"
            >
              Email Address
            </label>
            <input
              id="owner-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@yabahotels.com"
              className="w-full px-4 py-3 rounded-xl border border-[#29211C]/15 bg-[#FFF8F0]/30 text-[#29211C] text-sm placeholder-[#766D65]/50 focus:outline-none focus:border-[#E85D16] focus:ring-2 focus:ring-[#E85D16]/20 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="owner-password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#29211C] mb-2"
            >
              Password
            </label>
            <input
              id="owner-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-[#29211C]/15 bg-[#FFF8F0]/30 text-[#29211C] text-sm placeholder-[#766D65]/50 focus:outline-none focus:border-[#E85D16] focus:ring-2 focus:ring-[#E85D16]/20 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-white font-medium text-[15px] bg-[#E85D16] hover:bg-[#B94720] shadow-[0_6px_18px_rgba(232,93,22,0.25)] hover:shadow-[0_8px_24px_rgba(232,93,22,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D16] focus-visible:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In as Owner</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
