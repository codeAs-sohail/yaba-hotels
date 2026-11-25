import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearTokens } from '../features/auth/authSlice';
import OwnerDashboard from './OwnerDashboard/OwnerDashboard';

/**
 * Protected Route container for the Owner Dashboard.
 * Redirects unauthenticated visits to the secret owner login page.
 * Automatically logs out the admin if they navigate away from the owner dashboard.
 */
export default function Owner() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!access) {
      navigate('/Yaba7qK29700rest', { replace: true });
    }
  }, [access, navigate]);

  // When unmounting (navigating away from /owner), automatically log out
  useEffect(() => {
    return () => {
      dispatch(clearTokens());
    };
  }, [dispatch]);

  if (!access) {
    return null;
  }

  return <OwnerDashboard />;
}
