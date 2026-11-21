import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * BranchSelection Page – Yaba Fast Food
 * Displays all branches as individual animated cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop).
 * Clicking any card routes to /menu/:branchId for that specific branch.
 */
export default function BranchSelection() {
  const navigate = useNavigate();
  const { data: branches = [], isLoading, isError, error, refetch } = useGetBranchesQuery();

  useEffect(() => {
    document.title = 'Select Branch | Yaba Fast Food Menu';
    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = (branchId) => {
    navigate(`/menu/${branchId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEA] text-[#141414] font-sans selection:bg-[#F2E205] selection:text-[#141414]">
      {/* Background paper texture pattern */}
      <div
        className="w-full pb-20 pt-6 sm:pt-8"
        style={{
          backgroundImage: 'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pb-4">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-[#555555]">
              <li>
                <Link
                  to="/home"
                  className="hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2E205] rounded px-1.5 py-0.5 transition-colors font-medium text-[#555555] hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#141414]/30 select-none">
                /
              </li>
              <li aria-current="page" className="font-semibold text-[#141414] px-1.5 py-0.5">
                Menu & Branches
              </li>
            </ol>
          </nav>

          {/* Section Hero Header */}
          <div className="text-center max-w-3xl mx-auto pt-4 pb-10 sm:pb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#141414] text-[#F2E205] mb-4 shadow-xs">
              🥢 Choose Your Location
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight leading-tight">
              Select Your Nearest Branch
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
              Experience the genuine taste and trust of Hyderabad's favourite Chinese fast food.
              Pick your branch to explore fresh items, prices, and direct delivery options.
            </p>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#141414]/10 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded w-4/5" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 bg-gray-200 rounded w-2/3" />
                    <div className="h-3.5 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-11 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                Unable to Load Branches
              </h2>
              <p className="text-sm text-[#555555] mt-2 mb-6">
                {error?.data?.detail || error?.error || 'Something went wrong while retrieving our branches. Please try again.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#141414] text-[#F2E205] hover:bg-black transition-all shadow-md active:scale-95 cursor-pointer"
              >
                ↻ Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && branches.length === 0 && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 sm:p-14 border border-[#141414]/10 shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
                🏪
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                No Branches Found
              </h2>
              <p className="text-sm text-[#555555] mt-2">
                We are setting up branches across Hyderabad. Please check back shortly!
              </p>
            </div>
          )}

          {/* Animated Branch Cards Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
          {!isLoading && !isError && branches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {branches.map((branch, index) => (
                <div
                  key={branch.id}
                  onClick={() => handleCardClick(branch.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(branch.id);
                    }
                  }}
                  className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-[#141414]/10 hover:border-[#141414]/40 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F2E205]"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {/* Decorative Corner Accent on Hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#F2E205]/20 to-transparent rounded-tr-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Top Branding Row */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#F2E205] text-[#141414] font-bold text-xs flex items-center justify-center shadow-xs">
                          YB
                        </span>
                        <span className="text-xs uppercase font-extrabold tracking-wider text-[#141414]/80">
                          Yaba Fast Food
                        </span>
                      </div>

                      {/* Menu Items Count Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEA] text-[#141414] border border-[#F2E205]">
                        🍽️ {branch.menu_count || 0} Dishes
                      </span>
                    </div>

                    {/* Visually Prominent Branch Address */}
                    <div className="mb-5">
                      <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#141414] group-hover:text-[#E85D16] transition-colors leading-tight">
                        {branch.address}
                      </h2>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#766D65] mt-1">
                        Hyderabad Outlet
                      </p>
                    </div>

                    {/* Contact Information & Metadata */}
                    <div className="space-y-2.5 pt-2 border-t border-[#141414]/8 text-xs sm:text-sm text-[#555555]">
                      {/* Phone Number */}
                      {branch.phone_number ? (
                        <div className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-[#141414] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a
                            href={`tel:${branch.phone_number}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#141414] hover:underline font-medium transition-colors"
                          >
                            {branch.phone_number}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 text-gray-400">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Phone on request</span>
                        </div>
                      )}

                      {/* Email Address */}
                      {branch.email ? (
                        <div className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-[#141414] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a
                            href={`mailto:${branch.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-[#141414] hover:underline font-medium transition-colors truncate"
                          >
                            {branch.email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5 text-gray-400">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>support@yabafastfood.com</span>
                        </div>
                      )}

                      {/* Location button / icon if a location URL exists */}
                      {branch.location && (
                        <div className="pt-1">
                          <a
                            href={branch.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D16] hover:text-[#141414] transition-colors py-1 px-2.5 rounded-lg bg-orange-50/80 hover:bg-orange-100 border border-orange-200/60"
                          >
                            <svg className="w-3.5 h-3.5 text-[#E85D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Open in Google Maps</span>
                            <span className="text-[10px]">↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prominent Call to Action */}
                  <div className="mt-6 pt-4 border-t border-[#141414]/10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#766D65] group-hover:text-[#141414] transition-colors">
                      View Menu & Order
                    </span>
                    <span className="w-10 h-10 rounded-2xl bg-[#FFFBEA] border border-[#141414]/15 group-hover:bg-[#F2E205] group-hover:border-[#141414] text-[#141414] flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-xs group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}