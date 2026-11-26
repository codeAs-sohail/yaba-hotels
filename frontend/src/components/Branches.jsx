import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import JourneyTimeline from './about/JourneyTimeline';
import ScrollReveal from './ScrollReveal';
import { useGetBranchesQuery } from '../features/dashboard/dashboardApi';

/**
 * Branches Page: Interactive Journey Timeline paired with a clean 5-branch
 * contact & menu directory.
 */
export default function Branches() {
  const { data: dbBranches = [] } = useGetBranchesQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16] pb-20">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
      >
        <ol className="flex items-center gap-2 text-xs text-[#685F57]">
          <li>
            <Link
              to="/home"
              className="hover:text-[#E85D16] transition-colors"
            >
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#DED4C8]">/</li>
          <li aria-current="page" className="font-semibold text-[#1E1916]">
            Branches
          </li>
        </ol>
      </nav>

      {/* Branch Journey Timeline */}
      <JourneyTimeline />

      {/* Direct Branch Directory */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 pt-12 border-t border-[#E6DDD2]">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-9 sm:mb-11">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            Outlet Directory
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1916] tracking-tight">
            Call Your Nearest Yaba Branch
          </h2>
          <p className="text-sm sm:text-base text-[#685F57] mt-2">
            Reach our kitchens directly for takeaway prep, family dining reservations, or outlet directions.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {dbBranches.map((branch, idx) => (
            <ScrollReveal key={branch.id} delay={(idx % 3) * 60}>
              <div className="h-full bg-white rounded-xl p-5 sm:p-6 border border-[#E6DDD2] hover:border-[#E85D16]/50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E85D16]">
                      Hyderabad Outlet
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded bg-[#FCF9F4] border border-[#E6DDD2] text-[#685F57]">
                      Open Daily
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1916] leading-snug mb-4">
                    {branch.address}
                  </h3>

                  <div className="p-3.5 rounded-lg bg-[#FCF9F4] border border-[#E6DDD2] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#685F57]">
                        Direct Telephone
                      </div>
                      <a
                        href={`tel:${branch.phone_number || '8686278001'}`}
                        className="text-base font-semibold text-[#1E1916] hover:text-[#E85D16] transition-colors tabular-nums"
                      >
                        {branch.phone_number || '8686278001'}
                      </a>
                    </div>
                    <svg className="w-4 h-4 text-[#E85D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-[#F0EAE1] flex items-center gap-2">
                  <a
                    href={`tel:${branch.phone_number || '8686278001'}`}
                    className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-lg font-semibold text-xs sm:text-sm bg-[#E85D16] hover:bg-[#CC4D0D] text-white transition-colors"
                  >
                    <span>Call Branch</span>
                  </a>

                  {branch.location && (
                    <a
                      href={branch.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[42px] inline-flex items-center justify-center px-3 py-2 rounded-lg font-medium text-xs bg-white hover:border-[#E85D16] text-[#1E1916] border border-[#E2D8CE] transition-colors"
                      title="Open in Google Maps"
                    >
                      Maps ↗
                    </a>
                  )}

                  <Link
                    to={`/menu/${branch.id}`}
                    className="min-h-[42px] inline-flex items-center justify-center px-3.5 py-2 rounded-lg font-semibold text-xs bg-[#1E1916] hover:bg-[#38302A] text-white transition-colors"
                  >
                    Menu →
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <ScrollReveal className="max-w-xl mx-auto text-center px-4 mt-14">
        <p className="text-sm sm:text-base text-[#685F57] mb-5">
          Ready to explore tonight’s specials across your selected outlet?
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-[#E85D16] hover:bg-[#CC4D0D] transition-colors"
        >
          Explore Our Menu
        </Link>
      </ScrollReveal>
    </article>
  );
}
