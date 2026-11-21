import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * Aesthetic Contact Us Page for Yaba Fast Food
 * Displays emails, phone numbers, addresses, and call actions for all 5 branches in Hyderabad,
 * dynamically fetched from the database.
 */
export default function Contact() {
  const { data: branches = [], isLoading, isError, refetch } = useGetBranchesQuery();

  useEffect(() => {
    document.title = 'Contact Us | Yaba Fast Food';
    window.scrollTo(0, 0);
  }, []);

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
                  className="hover:text-[#141414] transition-colors font-medium hover:underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#141414]/30 select-none">
                /
              </li>
              <li aria-current="page" className="font-semibold text-[#141414]">
                Contact Us
              </li>
            </ol>
          </nav>

          {/* Hero Header Section */}
          <header className="text-center max-w-3xl mx-auto pt-4 pb-10 sm:pb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#141414] text-[#F2E205] mb-3 shadow-xs">
              📍 5 KITCHENS ACROSS HYDERABAD
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight leading-tight">
              Get in Touch with Us
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed">
              Craving our signature Chicken 65 or have a question?
              Reach out directly to any of our 5 branch kitchens across the city.
            </p>
          </header>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#141414]/10 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-7 bg-gray-200 rounded w-3/4" />
                  <div className="h-12 bg-gray-100 rounded-2xl" />
                  <div className="h-10 bg-gray-100 rounded-2xl" />
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
                Unable to Load Branch Contacts
              </h2>
              <p className="text-sm text-[#555555] mt-2 mb-6">
                Something went wrong while retrieving our contact directory.
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

          {/* 5 Branches Contact Cards Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
          {!isLoading && !isError && branches.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {branches.map((branch, index) => {
                const phone = branch.phone_number || '8686278001';
                const email = branch.email || 'support@yabafastfood.com';

                return (
                  <div
                    key={branch.id}
                    className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-[#141414]/10 hover:border-[#141414]/30 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Decorative Top Accent Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F2E205]/25 via-[#F2E205]/10 to-transparent rounded-tr-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Top Meta Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#F2E205] text-[#141414] font-serif font-black text-xs flex items-center justify-center shadow-xs">
                            YB
                          </span>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#766D65]">
                            Outlet #{index + 1}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● Open Daily
                        </span>
                      </div>

                      {/* Prominent Branch Address */}
                      <h2 className="font-serif text-2xl font-black text-[#141414] group-hover:text-[#E85D16] transition-colors leading-tight mb-2">
                        {branch.address}
                      </h2>

                      {/* Timings */}
                      <div className="flex items-center gap-1.5 text-xs text-[#766D65] mb-5">
                        <span className="text-[#E85D16]">🕒</span>
                        <span className="font-medium">1:00 PM – 1:30 AM (Late Night Wok)</span>
                      </div>

                      {/* Contact Info Pills */}
                      <div className="space-y-3 pt-4 border-t border-[#141414]/8">
                        {/* PHONE NUMBER */}
                        <div className="p-3.5 rounded-2xl bg-[#FFFBEA] border border-[#F2E205]/60 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#141414]/10 text-emerald-700 flex items-center justify-center text-base flex-shrink-0 shadow-2xs">
                              📞
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#766D65]">
                                Phone Number
                              </div>
                              <a
                                href={`tel:${phone}`}
                                className="text-sm sm:text-base font-extrabold text-[#141414] hover:text-[#E85D16] transition-colors truncate block"
                              >
                                {phone}
                              </a>
                            </div>
                          </div>
                          <a
                            href={`tel:${phone}`}
                            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            <span>Call</span>
                          </a>
                        </div>

                        {/* EMAIL ADDRESS */}
                        <div className="p-3.5 rounded-2xl bg-white border border-[#141414]/10 hover:border-[#141414]/25 transition-all flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#141414]/10 text-[#141414] flex items-center justify-center text-base flex-shrink-0 shadow-2xs">
                              ✉️
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#766D65]">
                                Email Address
                              </div>
                              <a
                                href={`mailto:${email}`}
                                className="text-xs sm:text-sm font-bold text-[#141414] hover:text-[#E85D16] transition-colors truncate block"
                                title={email}
                              >
                                {email}
                              </a>
                            </div>
                          </div>
                          <a
                            href={`mailto:${email}`}
                            className="flex-shrink-0 text-xs font-bold text-[#141414] hover:text-[#E85D16] hover:underline px-1"
                          >
                            Email ↗
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions: Google Maps & Menu Link */}
                    <div className="mt-6 pt-4 border-t border-[#141414]/8 flex items-center justify-between gap-3">
                      {branch.location ? (
                        <a
                          href={branch.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D16] hover:text-[#141414] transition-colors py-1.5 px-3 rounded-xl bg-orange-50/80 hover:bg-orange-100 border border-orange-200/60"
                        >
                          <span>📍 Google Maps</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Hyderabad, Telangana</span>
                      )}

                      <Link
                        to={`/menu/${branch.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141414] hover:text-[#E85D16] transition-colors group-hover:translate-x-0.5"
                      >
                        <span>View Menu</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}