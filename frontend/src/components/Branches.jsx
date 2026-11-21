import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import JourneyTimeline from './about/JourneyTimeline';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * Branches Page: prominently displays the exact interactive Journey Timeline
 * branch chart with all founding years, branch details, colors, phone numbers from DB,
 * and direct Call & "Open in Maps" actions.
 */
export default function Branches() {
  const { data: dbBranches = [], isLoading: loadingBranches } = useGetBranchesQuery();

  useEffect(() => {
    document.title = 'Our Branches & Journey | Yaba Fast Food';
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#FFFBEA] text-[#141414] font-sans selection:bg-[#F2E205] selection:text-[#141414]">
      {/* Background paper texture */}
      <div
        className="w-full pb-16"
        style={{
          backgroundImage:
            'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
        >
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
            <li
              aria-current="page"
              className="font-semibold text-[#141414] px-1.5 py-0.5"
            >
              Branches
            </li>
          </ol>
        </nav>

        {/* The Exact Branch Chart & Timeline */}
        <JourneyTimeline />

        {/* Direct Branch Outlets Directory with Phone Numbers from DB */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 pt-10 border-t border-[#141414]/10">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#141414] text-[#F2E205] mb-2.5">
              📞 Direct Outlet Directory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#141414] tracking-tight">
              Call Your Nearest Yaba Branch
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] mt-1.5">
              Call our kitchen directly for quick takeaway prep or outlet enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {dbBranches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#141414]/10 hover:border-[#141414]/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#766D65]">
                      Hyderabad Outlet
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFFBEA] border border-[#F2E205] text-[#141414]">
                      Open Daily
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#141414] leading-tight mb-2">
                    {branch.address}
                  </h3>

                  {/* Phone number display */}
                  <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEA] border border-[#F2E205]/60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#766D65]">
                        Contact Number
                      </div>
                      <div className="text-base font-extrabold text-[#141414]">
                        {branch.phone_number || '8686278001'}
                      </div>
                    </div>
                    <span className="text-xl">📞</span>
                  </div>
                </div>

                {/* Actions: Call Button & Maps */}
                <div className="mt-5 pt-3 border-t border-[#141414]/8 flex items-center gap-2.5">
                  <a
                    href={`tel:${branch.phone_number || '8686278001'}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
                  >
                    <span>📞 Call Now</span>
                  </a>

                  {branch.location && (
                    <a
                      href={branch.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2.5 rounded-xl font-bold text-xs bg-[#FFFBEA] hover:bg-[#F2E205] text-[#141414] border border-[#141414]/15 transition-colors shadow-xs"
                      title="Open in Google Maps"
                    >
                      <span>📍 Maps</span>
                    </a>
                  )}

                  <Link
                    to={`/menu/${branch.id}`}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl font-bold text-xs bg-[#141414] hover:bg-black text-[#F2E205] transition-colors shadow-xs"
                    title="View Menu"
                  >
                    <span>Menu →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Footer Action */}
        <div className="max-w-2xl mx-auto text-center px-4 mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-[#555555] mb-5">
            Craving your favourite Chinese fast food dishes today?
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#141414] bg-[#F2E205] hover:bg-[#E5D500] shadow-md hover:shadow-lg transition-all duration-200"
          >
            Explore Our Menu
          </Link>
        </div>
      </div>
    </article>
  );
}
