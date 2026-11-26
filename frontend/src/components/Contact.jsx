import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * Contact Us Page for Yaba Hotels
 * Displays telephone, email, directions, and direct menu links for all branches.
 */
export default function Contact() {
  const { data: branches = [], isLoading, isError, refetch } = useGetBranchesQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16] pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pb-4">
          <ol className="flex items-center gap-2 text-xs text-[#685F57]">
            <li>
              <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#DED4C8]">/</li>
            <li aria-current="page" className="font-semibold text-[#1E1916]">
              Contact Us
            </li>
          </ol>
        </nav>

        {/* Editorial Page Header */}
        <header className="text-center max-w-2xl mx-auto pt-2 pb-10 sm:pb-12">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            5 Kitchens Across Hyderabad
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-tight">
            Get in Touch with Us
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#685F57] leading-relaxed">
            Reach out directly to your nearest Yaba Hotels branch for takeaway orders, table enquiries, or outlet directions.
          </p>
        </header>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-[#E6DDD2] animate-pulse space-y-4"
              >
                <div className="h-4 bg-[#EFE7DC] rounded w-1/3" />
                <div className="h-7 bg-[#EFE7DC] rounded w-3/4" />
                <div className="h-12 bg-[#F7F2EA] rounded-lg" />
                <div className="h-10 bg-[#F7F2EA] rounded-lg" />
                <div className="h-10 bg-[#EFE7DC] rounded-lg mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-lg mx-auto bg-white rounded-xl p-8 border border-[#E6DDD2] text-center">
            <h2 className="font-serif text-xl font-semibold text-[#1E1916]">
              Unable to Load Branch Contacts
            </h2>
            <p className="text-sm text-[#685F57] mt-2 mb-6">
              Something went wrong while retrieving our branch contact directory.
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

        {/* Contact Cards Grid */}
        {!isLoading && !isError && branches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {branches.map((branch, index) => {
              const phone = branch.phone_number || '8686278001';
              const email = branch.email || 'support@yabafastfood.com';

              return (
                <ScrollReveal key={branch.id} delay={(index % 3) * 60}>
                  <div className="group h-full bg-white rounded-xl p-6 border border-[#E6DDD2] hover:border-[#E85D16]/60 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E85D16]">
                          Outlet 0{index + 1}
                        </span>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-[#FCF9F4] text-[#685F57] border border-[#E6DDD2]">
                          Open Daily
                        </span>
                      </div>

                      <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1916] group-hover:text-[#E85D16] transition-colors leading-snug mb-5">
                        {branch.address}
                      </h2>

                      <div className="space-y-3 pt-4 border-t border-[#F0EAE1]">
                        {/* Phone */}
                        <div className="p-3.5 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-white border border-[#E6DDD2] text-[#E85D16] flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#685F57]">
                                Telephone
                              </div>
                              <a
                                href={`tel:${phone}`}
                                className="text-sm sm:text-base font-semibold text-[#1E1916] hover:text-[#E85D16] transition-colors truncate block tabular-nums"
                              >
                                {phone}
                              </a>
                            </div>
                          </div>
                          <a
                            href={`tel:${phone}`}
                            className="flex-shrink-0 min-h-[36px] inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-xs transition-colors"
                          >
                            Call
                          </a>
                        </div>

                        {/* Email */}
                        <div className="p-3.5 rounded-lg bg-white border border-[#E6DDD2] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] text-[#685F57] flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#685F57]">
                                Email
                              </div>
                              <a
                                href={`mailto:${email}`}
                                className="text-xs sm:text-sm font-medium text-[#1E1916] hover:text-[#E85D16] transition-colors truncate block"
                                title={email}
                              >
                                {email}
                              </a>
                            </div>
                          </div>
                          <a
                            href={`mailto:${email}`}
                            className="flex-shrink-0 text-xs font-semibold text-[#E85D16] hover:underline px-1"
                          >
                            Mail ↗
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 pt-4 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
                      {branch.location ? (
                        <a
                          href={branch.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E1916] hover:text-[#E85D16] transition-colors py-1.5 px-3 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] hover:border-[#E85D16]"
                        >
                          <svg className="w-3.5 h-3.5 text-[#E85D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Directions</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#685F57]">Hyderabad, Telangana</span>
                      )}

                      <Link
                        to={`/menu/${branch.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#E85D16] hover:underline"
                      >
                        <span>View Menu</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
