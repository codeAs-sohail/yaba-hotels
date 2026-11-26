import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getSortedBranches } from '../../data/branchesData';
import { useGetBranchesQuery } from '../../features/dashboard/dashboardApi';
import ScrollReveal from '../ScrollReveal';

/**
 * Editorial Journey Timeline (Branch Chart).
 * - Desktop (>= 1024px): Horizontal Orange rail with alternating branch cards.
 * - Mobile / Tablet (< 1024px): Performant IntersectionObserver-driven vertical timeline.
 */
export default function JourneyTimeline() {
  const staticBranches = getSortedBranches();
  const { data: dbBranches = [] } = useGetBranchesQuery();

  const branches = useMemo(() => {
    return staticBranches.map((s, idx) => {
      const dbMatch = dbBranches.find(
        (d) =>
          d.address.toLowerCase().includes(s.name.toLowerCase()) ||
          s.name.toLowerCase().includes(d.address.toLowerCase()) ||
          d.id === idx + 1
      );
      return {
        ...s,
        dbId: dbMatch?.id || idx + 1,
        fullAddress: dbMatch?.address || `${s.name}, Hyderabad`,
        phoneNumber: dbMatch?.phone_number || '',
        mapUrl: dbMatch?.location || s.mapUrl,
      };
    });
  }, [staticBranches, dbBranches]);

  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileNodeRefs = useRef([]);

  // Lightweight IntersectionObserver on mobile nodes (no continuous scroll listener)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!Number.isNaN(idx)) {
              setActiveMobileIndex(idx);
            }
          }
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    mobileNodeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [branches.length]);

  const progressRatio = branches.length > 0 ? (activeMobileIndex + 1) / branches.length : 0.2;

  return (
    <section
      id="our-journey"
      aria-labelledby="journey-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:py-8 lg:py-12"
    >
      {/* Editorial Section Header */}
      <ScrollReveal className="text-center max-w-2xl mx-auto mb-8 lg:mb-14">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
          Hyderabad Heritage • Est. {branches[0]?.year || 2002}
        </p>
        <h1
          id="journey-heading"
          className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-tight"
        >
          Our Journey &amp; Outlets
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#685F57] leading-relaxed">
          From our founding kitchen in {branches[0]?.name || 'Tegal Kunta'} in {branches[0]?.year || 2002} to{' '}
          {branches.length} locations serving Hyderabad today.
        </p>
      </ScrollReveal>

      {/* Desktop Horizontal Timeline */}
      <div className="hidden lg:block relative py-16">
        <ol
          className="relative grid list-none p-0 m-0"
          style={{
            gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))`,
          }}
        >
          {/* Clean Horizontal Orange Track */}
          <div
            className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[3px] bg-[#E85D16]/25 rounded-full z-0"
            aria-hidden="true"
          >
            <div className="w-full h-full rounded-full bg-[#E85D16]/70" />
          </div>

          {branches.map((branch, index) => {
            const isTop = index % 2 === 0;

            return (
              <li
                key={branch.id || branch.name}
                tabIndex={0}
                className="group relative flex flex-col items-center justify-center focus:outline-none p-2"
                style={{ minHeight: '430px' }}
              >
                {isTop && (
                  <div className="absolute bottom-[calc(50%+20px)] flex flex-col items-center text-center">
                    <div className="w-56 p-4 rounded-xl bg-white border border-[#E6DDD2] group-hover:border-[#E85D16] transition-all duration-200 group-hover:-translate-y-1">
                      <span className="inline-block px-3 py-1 mb-2.5 rounded bg-[#FCF9F4] border border-[#E6DDD2] group-hover:bg-[#E85D16] group-hover:border-[#E85D16] group-hover:text-white font-serif text-sm font-semibold text-[#1E1916] transition-colors">
                        {branch.year}
                      </span>

                      <h3 className="font-serif font-semibold text-base text-[#1E1916] leading-snug">
                        {branch.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#685F57] leading-relaxed">
                        {branch.note}
                      </p>

                      {branch.phoneNumber && (
                        <p className="mt-2 text-xs font-semibold text-[#1E1916] tabular-nums">
                          {branch.phoneNumber}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] flex items-center justify-center gap-2">
                        {branch.phoneNumber && (
                          <a
                            href={`tel:${branch.phoneNumber}`}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-xs transition-colors"
                          >
                            Call
                          </a>
                        )}
                        {branch.mapUrl && (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#FCF9F4] hover:border-[#E85D16] text-[#1E1916] font-medium text-xs border border-[#E2D8CE] transition-colors"
                          >
                            Maps ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="w-px h-7 bg-[#E85D16]/45 group-hover:bg-[#E85D16] transition-colors" />
                  </div>
                )}

                {/* Track Node */}
                <div className="z-10 relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#FCF9F4] border-[3px] border-[#E85D16] transition-transform duration-200 group-hover:scale-125 group-hover:bg-[#E85D16]" />
                </div>

                {!isTop && (
                  <div className="absolute top-[calc(50%+20px)] flex flex-col items-center text-center">
                    <div className="w-px h-7 bg-[#E85D16]/45 group-hover:bg-[#E85D16] transition-colors" />

                    <div className="w-56 p-4 rounded-xl bg-white border border-[#E6DDD2] group-hover:border-[#E85D16] transition-all duration-200 group-hover:translate-y-1">
                      <span className="inline-block px-3 py-1 mb-2.5 rounded bg-[#FCF9F4] border border-[#E6DDD2] group-hover:bg-[#E85D16] group-hover:border-[#E85D16] group-hover:text-white font-serif text-sm font-semibold text-[#1E1916] transition-colors">
                        {branch.year}
                      </span>

                      <h3 className="font-serif font-semibold text-base text-[#1E1916] leading-snug">
                        {branch.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#685F57] leading-relaxed">
                        {branch.note}
                      </p>

                      {branch.phoneNumber && (
                        <p className="mt-2 text-xs font-semibold text-[#1E1916] tabular-nums">
                          {branch.phoneNumber}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-[#F0EAE1] flex items-center justify-center gap-2">
                        {branch.phoneNumber && (
                          <a
                            href={`tel:${branch.phoneNumber}`}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-xs transition-colors"
                          >
                            Call
                          </a>
                        )}
                        {branch.mapUrl && (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-[#FCF9F4] hover:border-[#E85D16] text-[#1E1916] font-medium text-xs border border-[#E2D8CE] transition-colors"
                          >
                            Maps ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile / Tablet Vertical Timeline */}
      <div className="block lg:hidden relative max-w-xl mx-auto px-1 sm:px-4 py-2">
        <div
          className="absolute left-3.5 sm:left-6 top-4 bottom-8 w-[2px] bg-[#E6DDD2] rounded-full overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="w-full bg-[#E85D16] transition-all duration-300 ease-out origin-top"
            style={{ height: `${progressRatio * 100}%` }}
          />
        </div>

        <ol className="relative space-y-6 list-none p-0 m-0">
          {branches.map((branch, index) => {
            const isActive = index === activeMobileIndex;

            return (
              <li
                key={branch.id || branch.name}
                ref={(el) => (mobileNodeRefs.current[index] = el)}
                data-index={index}
                className="relative flex items-start gap-4 sm:gap-5"
              >
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center mt-4 ml-[7px] sm:ml-[14px]">
                  <div
                    className={`rounded-full border-[3px] transition-all duration-300 ${
                      isActive
                        ? 'w-4 h-4 bg-[#E85D16] border-[#FCF9F4] ring-2 ring-[#E85D16]/40 scale-110'
                        : 'w-3.5 h-3.5 bg-[#FCF9F4] border-[#E85D16]'
                    }`}
                  />
                </div>

                <ScrollReveal className="flex-grow" delay={index * 50}>
                  <div
                    className={`rounded-xl bg-white p-4 sm:p-5 border transition-colors ${
                      isActive ? 'border-[#E85D16]' : 'border-[#E6DDD2]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-serif text-lg sm:text-xl font-semibold text-[#E85D16]">
                        {branch.year}
                      </span>
                      <span className="text-[11px] font-medium text-[#685F57] uppercase tracking-wider">
                        Branch 0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-serif font-semibold text-lg text-[#1E1916]">
                      {branch.name}
                    </h3>

                    <p className="mt-1 text-xs sm:text-sm text-[#685F57] leading-relaxed">
                      {branch.note}
                    </p>

                    {branch.phoneNumber && (
                      <p className="mt-2.5 text-xs font-semibold text-[#1E1916] tabular-nums">
                        Tel: {branch.phoneNumber}
                      </p>
                    )}

                    <div className="mt-3.5 pt-3 border-t border-[#F0EAE1] flex items-center gap-2 flex-wrap">
                      {branch.phoneNumber && (
                        <a
                          href={`tel:${branch.phoneNumber}`}
                          className="min-h-[38px] inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-xs transition-colors"
                        >
                          Call Branch
                        </a>
                      )}
                      {branch.mapUrl && (
                        <a
                          href={branch.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#FCF9F4] hover:border-[#E85D16] text-[#1E1916] font-medium text-xs border border-[#E2D8CE] transition-colors"
                        >
                          Google Maps ↗
                        </a>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
