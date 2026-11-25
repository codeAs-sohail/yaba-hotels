import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OwnerDashboard from './OwnerDashboard/OwnerDashboard';

/**
 * Protected Route container for the Owner Dashboard.
 * Redirects unauthenticated visits to the secret owner login page.
 */
export default function Owner() {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!access) {
      navigate('/Yaba7qK29700rest', { replace: true });
    }
  }, [access, navigate]);

  if (!access) {
    return null;
  }

  return <OwnerDashboard />;
}
