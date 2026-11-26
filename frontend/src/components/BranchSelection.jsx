import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * BranchSelection Page – Yaba Hotels
 * Displays all outlets as clean cards routing to /menu/:branchId.
 */
export default function BranchSelection() {
  const navigate = useNavigate();
  const { data: branches = [], isLoading, isError, error, refetch } = useGetBranchesQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = (branchId) => {
    navigate(`/menu/${branchId}`);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16] pb-20 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="pb-4">
          <ol className="flex items-center gap-2 text-xs text-[#685F57]">
            <li>
              <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#DED4C8]">/</li>
            <li aria-current="page" className="font-semibold text-[#1E1916]">
              Menu &amp; Branches
            </li>
          </ol>
        </nav>

        <header className="text-center max-w-2xl mx-auto pt-2 pb-10 sm:pb-12">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            Choose Your Location
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-tight">
            Select Your Nearest Branch
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#685F57] leading-relaxed">
            Pick an outlet to browse live dish availability, portion pricing, and direct ordering links.
          </p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-[#E6DDD2] animate-pulse space-y-4"
              >
                <div className="h-4 bg-[#EFE7DC] rounded w-1/3" />
                <div className="h-7 bg-[#EFE7DC] rounded w-4/5" />
                <div className="space-y-2 pt-2">
                  <div className="h-3.5 bg-[#F7F2EA] rounded w-2/3" />
                  <div className="h-3.5 bg-[#F7F2EA] rounded w-1/2" />
                </div>
                <div className="h-11 bg-[#EFE7DC] rounded-lg mt-4" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="max-w-lg mx-auto bg-white rounded-xl p-8 border border-[#E6DDD2] text-center">
            <h2 className="font-serif text-xl font-semibold text-[#1E1916]">
              Unable to Load Branches
            </h2>
            <p className="text-sm text-[#685F57] mt-2 mb-6">
              {error?.data?.detail || error?.error || 'Something went wrong while retrieving our branches.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg font-semibold text-sm bg-[#E85D16] hover:bg-[#CC4D0D] text-white transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !isError && branches.length === 0 && (
          <div className="max-w-lg mx-auto bg-white rounded-xl p-10 border border-[#E6DDD2] text-center">
            <h2 className="font-serif text-xl font-semibold text-[#1E1916]">
              No Branches Found
            </h2>
            <p className="text-sm text-[#685F57] mt-2">
              Outlet listings are being updated. Please check back shortly.
            </p>
          </div>
        )}

        {!isLoading && !isError && branches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {branches.map((branch, index) => (
              <ScrollReveal key={branch.id} delay={(index % 3) * 60}>
                <div
                  onClick={() => handleCardClick(branch.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(branch.id);
                    }
                  }}
                  className="group h-full bg-white rounded-xl p-6 border border-[#E6DDD2] hover:border-[#E85D16] transition-colors flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E85D16]">
                        Yaba Hotels
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#FCF9F4] text-[#685F57] border border-[#E6DDD2]">
                        {branch.menu_count || 0} Dishes
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-semibold text-[#1E1916] group-hover:text-[#E85D16] transition-colors leading-snug mb-1">
                      {branch.address}
                    </h2>
                    <p className="text-xs font-medium uppercase tracking-wider text-[#685F57] mb-5">
                      Hyderabad Outlet
                    </p>

                    <div className="space-y-2.5 pt-3.5 border-t border-[#F0EAE1] text-xs sm:text-sm text-[#685F57]">
                      {branch.phone_number && (
                        <div className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-[#E85D16] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a
                            href={`tel:${branch.phone_number}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#E85D16] font-medium tabular-nums"
                          >
                            {branch.phone_number}
                          </a>
                        </div>
                      )}

                      {branch.email && (
                        <div className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-[#685F57] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a
                            href={`mailto:${branch.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#E85D16] truncate"
                          >
                            {branch.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1916] group-hover:text-[#E85D16] transition-colors">
                      View Outlet Menu
                    </span>
                    <span className="w-9 h-9 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] group-hover:bg-[#E85D16] group-hover:border-[#E85D16] group-hover:text-white text-[#1E1916] flex items-center justify-center text-sm transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
