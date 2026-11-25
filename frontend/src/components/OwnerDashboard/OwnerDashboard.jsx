import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/authApi';
import { clearTokens } from '../../features/auth/authSlice';

import DashboardTabs from './components/DashboardTabs';
import MenuManagement from './components/MenuManagement';
import GalleryManagement from './components/GalleryManagement';
import BranchManagement from './components/BranchManagement';
import FeedbackManagement from './components/FeedbackManagement';

/**
 * Yaba Fast Food – Owner Dashboard Main Component.
 * Contains the 4 main sections in exact sequence:
 * 1. Menus
 * 2. Gallery
 * 3. Branches
 * 4. Feedback
 */
export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('menus');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refresh } = useSelector((state) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (refresh) {
        await logout({ refresh }).unwrap();
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      dispatch(clearTokens());
      navigate('/Yaba7qK29700rest', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] text-[#141414] font-sans selection:bg-[#F2E205] selection:text-[#141414]">
      {/* Background paper texture */}
      <div
        className="w-full min-h-screen pb-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Top Header / Branding Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#141414]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2E205] border-2 border-[#141414] flex items-center justify-center font-serif font-black text-xl text-[#141414] shadow-xs">
                Y
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg sm:text-xl text-[#141414] leading-none">
                  Yaba Fast Food
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#766D65] mt-1">
                  Owner Management Dashboard
                </p>
              </div>
            </div>

            {/* Owner Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admin Active</span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors focus:outline-none"
              >
                <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* 4 Dashboard Navigation Tabs (Menus, Gallery, Branches, Feedback) */}
        <DashboardTabs activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Tab Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'menus' && <MenuManagement />}
          {activeTab === 'gallery' && <GalleryManagement />}
          {activeTab === 'branches' && <BranchManagement />}
          {activeTab === 'feedback' && <FeedbackManagement />}
        </main>
      </div>
    </div>
  );
}
