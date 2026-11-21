import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getSortedBranches } from '../../data/branchesData';
import { useGetBranchesQuery } from '../../features/dashboard/dashboardApi';

/**
 * Main Journey Timeline Component (Branch Chart).
 * - Immediately fully visible when the page loads (no blank/hidden delay).
 * - Fetches real branch phone numbers dynamically from the database.
 * - Displays phone numbers with quick "Call Branch" action buttons.
 * - Desktop (>= 1024px): Horizontal pill track with alternating top/bottom branch cards,
 *   dashed connectors, glowing nodes, year badges, phone number, and interactive "Call" & "Open in Maps" buttons.
 * - Mobile / Tablet (< 1024px): Vertical rail with scroll-linked progress fill and active node detection.
 */
export default function JourneyTimeline() {
  const staticBranches = getSortedBranches();
  const { data: dbBranches = [] } = useGetBranchesQuery();

  // Merge static milestone narrative with real database records (phone numbers, addresses)
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

  // Fully visible by default so it is immediately rendered on page load
  const [isVisible, setIsVisible] = useState(true);

  // Mobile scroll progress state
  const mobileRailRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0.2);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileNodeRefs = useRef([]);

  // Mobile scroll-linked progress and active node calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!mobileRailRef.current) return;

      const rect = mobileRailRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const centerY = viewportHeight / 2;

      // Calculate progress of rail passing through viewport center
      const railTop = rect.top;
      const railHeight = rect.height;

      if (railHeight > 0) {
        const rawProgress = (centerY - railTop) / railHeight;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));
        setScrollProgress(clampedProgress);
      }

      // Find node nearest to viewport center
      let closestIdx = 0;
      let minDistance = Infinity;

      mobileNodeRefs.current.forEach((el, index) => {
        if (el) {
          const nodeRect = el.getBoundingClientRect();
          const nodeCenter = nodeRect.top + nodeRect.height / 2;
          const dist = Math.abs(nodeCenter - centerY);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = index;
          }
        }
      });

      setActiveMobileIndex(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [branches.length]);

  return (
    <section
      id="our-journey"
      aria-labelledby="journey-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14"
    >
      {/* Chart Eyebrow & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-16">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-1.5 w-6 rounded-full bg-[#F2E205]" />
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#141414]/75">
            Interactive Branch Timeline
          </span>
          <span className="h-1.5 w-6 rounded-full bg-[#F2E205]" />
        </div>
        <h2
          id="journey-heading"
          className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] tracking-tight"
        >
          Our Journey &amp; Outlets
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[#555555] font-sans">
          Tracing Yaba from our first kitchen in {branches[0]?.name || 'Tegal Kunta'} (2002) to{' '}
          {branches.length} locations across Hyderabad.
        </p>
      </div>

      {/* ============================================================== */}
      {/* A) DESKTOP / LARGE SCREENS (>= 1024px): HORIZONTAL TIMELINE */}
      {/* ============================================================== */}
      <div className="hidden lg:block relative py-20">
        <ol
          className="relative grid list-none p-0 m-0"
          style={{
            gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))`,
          }}
        >
          {/* Horizontal Central Track Bar with Yaba Yellow glow */}
          <div
            className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-3.5 bg-[#F2E205]/40 rounded-full border-2 border-[#F2E205] shadow-[0_0_16px_rgba(242,226,5,0.45)] z-0"
            aria-hidden="true"
          >
            {/* Inner highlight line */}
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#F2E205]/60 via-[#F2E205] to-[#F2E205]/60" />
          </div>

          {branches.map((branch, index) => {
            const isTop = index % 2 === 0; // Alternating: 0 is top, 1 is bottom, 2 is top, etc.

            return (
              <li
                key={branch.id || branch.name}
                tabIndex={0}
                className="group relative flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] rounded-2xl p-2 transition-transform duration-300"
                style={{
                  minHeight: '460px',
                }}
              >
                {/* ----------------- TOP CARD (when isTop is true) ----------------- */}
                {isTop && (
                  <div className="absolute bottom-[calc(50%+26px)] flex flex-col items-center text-center transition-all duration-300 ease-out">
                    {/* Card container */}
                    <div className="w-56 p-4 rounded-2xl bg-white border border-[#141414]/12 shadow-md transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-focus-visible:-translate-y-2 group-focus-visible:shadow-2xl relative">
                      {/* Year badge circle */}
                      <div className="w-16 h-16 mx-auto mb-2.5 rounded-full bg-[#FFFBEA] border-2 border-[#141414]/15 flex items-center justify-center font-serif text-xl font-bold text-[#141414] shadow-inner transition-all duration-300 group-hover:bg-[#F2E205] group-hover:scale-105 group-focus-visible:bg-[#F2E205] group-focus-visible:scale-105">
                        {branch.year}
                      </div>

                      {/* Branch Name */}
                      <h3 className="font-sans font-bold text-base text-[#141414] leading-snug">
                        {branch.name}
                      </h3>

                      {/* Branch Note */}
                      <p className="mt-1 text-xs text-[#555555] leading-relaxed">
                        {branch.note}
                      </p>

                      {/* Phone Number from DB */}
                      {branch.phoneNumber && (
                        <div className="mt-2 text-xs font-bold text-[#141414] bg-[#FFFBEA] py-1 px-2 rounded-lg border border-[#F2E205]/70 flex items-center justify-center gap-1.5">
                          <span>📞</span>
                          <span>{branch.phoneNumber}</span>
                        </div>
                      )}

                      {/* Action Buttons: Call & Maps */}
                      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
                        {branch.phoneNumber && (
                          <a
                            href={`tel:${branch.phoneNumber}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-200"
                            aria-label={`Call ${branch.name} at ${branch.phoneNumber}`}
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        {branch.mapUrl && (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFFBEA] hover:bg-[#F2E205] text-[#141414] font-bold text-xs border border-[#141414]/15 shadow-xs hover:shadow-sm transition-all duration-200"
                            aria-label={`Open ${branch.name} in Google Maps`}
                          >
                            <span>Maps ↗</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Dashed vertical connector from top card to node */}
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-[#141414]/40 transition-colors duration-300 group-hover:border-solid group-hover:border-[#141414] group-focus-visible:border-solid group-focus-visible:border-[#141414]" />
                  </div>
                )}

                {/* ----------------- CENTRAL NODE ON THE HORIZONTAL TRACK ----------------- */}
                <div className="z-10 relative flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#141414] border-4 border-[#FFFBEA] shadow-md transition-all duration-300 group-hover:scale-130 group-hover:bg-[#F2E205] group-hover:ring-4 group-hover:ring-[#F2E205]/60 group-focus-visible:scale-130 group-focus-visible:bg-[#F2E205] group-focus-visible:ring-4 group-focus-visible:ring-[#F2E205]/60" />
                </div>

                {/* ----------------- BOTTOM CARD (when isTop is false) ----------------- */}
                {!isTop && (
                  <div className="absolute top-[calc(50%+26px)] flex flex-col items-center text-center transition-all duration-300 ease-out">
                    {/* Dashed vertical connector from node to bottom card */}
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-[#141414]/40 transition-colors duration-300 group-hover:border-solid group-hover:border-[#141414] group-focus-visible:border-solid group-focus-visible:border-[#141414]" />

                    {/* Card container */}
                    <div className="w-56 p-4 rounded-2xl bg-white border border-[#141414]/12 shadow-md transition-all duration-300 ease-out group-hover:translate-y-2 group-hover:shadow-2xl group-focus-visible:translate-y-2 group-focus-visible:shadow-2xl relative">
                      {/* Year badge circle */}
                      <div className="w-16 h-16 mx-auto mb-2.5 rounded-full bg-[#FFFBEA] border-2 border-[#141414]/15 flex items-center justify-center font-serif text-xl font-bold text-[#141414] shadow-inner transition-all duration-300 group-hover:bg-[#F2E205] group-hover:scale-105 group-focus-visible:bg-[#F2E205] group-focus-visible:scale-105">
                        {branch.year}
                      </div>

                      {/* Branch Name */}
                      <h3 className="font-sans font-bold text-base text-[#141414] leading-snug">
                        {branch.name}
                      </h3>

                      {/* Branch Note */}
                      <p className="mt-1 text-xs text-[#555555] leading-relaxed">
                        {branch.note}
                      </p>

                      {/* Phone Number from DB */}
                      {branch.phoneNumber && (
                        <div className="mt-2 text-xs font-bold text-[#141414] bg-[#FFFBEA] py-1 px-2 rounded-lg border border-[#F2E205]/70 flex items-center justify-center gap-1.5">
                          <span>📞</span>
                          <span>{branch.phoneNumber}</span>
                        </div>
                      )}

                      {/* Action Buttons: Call & Maps */}
                      <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
                        {branch.phoneNumber && (
                          <a
                            href={`tel:${branch.phoneNumber}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all duration-200"
                            aria-label={`Call ${branch.name} at ${branch.phoneNumber}`}
                          >
                            <span>📞 Call</span>
                          </a>
                        )}

                        {branch.mapUrl && (
                          <a
                            href={branch.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFFBEA] hover:bg-[#F2E205] text-[#141414] font-bold text-xs border border-[#141414]/15 shadow-xs hover:shadow-sm transition-all duration-200"
                            aria-label={`Open ${branch.name} in Google Maps`}
                          >
                            <span>Maps ↗</span>
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

      {/* ============================================================== */}
      {/* B) MOBILE / TABLET (< 1024px): VERTICAL TIMELINE */}
      {/* ============================================================== */}
      <div className="block lg:hidden relative max-w-xl mx-auto px-2 sm:px-4 py-4">
        {/* Continuous Vertical Rail on the Left */}
        <div
          ref={mobileRailRef}
          className="absolute left-6 sm:left-8 top-3 bottom-8 w-1.5 bg-[#141414]/15 rounded-full overflow-hidden"
          aria-hidden="true"
        >
          {/* Scroll-Linked Progress Fill */}
          <div
            className="w-full bg-[#F2E205] rounded-full transition-all duration-150 ease-out origin-top"
            style={{
              height: `${Math.max(0.15, scrollProgress) * 100}%`,
            }}
          />
        </div>

        {/* Stacked Branch Items */}
        <ol className="relative space-y-7 list-none p-0 m-0">
          {branches.map((branch, index) => {
            const isActive = index === activeMobileIndex;

            return (
              <li
                key={branch.id || branch.name}
                tabIndex={0}
                className="relative flex items-start gap-4 sm:gap-6 focus:outline-none group active:scale-[0.98] transition-transform duration-150"
              >
                {/* Node on Vertical Rail */}
                <div
                  ref={(el) => (mobileNodeRefs.current[index] = el)}
                  className="relative z-10 flex-shrink-0 flex items-center justify-center mt-3"
                >
                  <div
                    className={`rounded-full border-4 border-[#FFFBEA] shadow-md transition-all duration-300 ${
                      isActive
                        ? 'w-7 h-7 -ml-1.5 bg-[#F2E205] ring-4 ring-[#F2E205]/50 scale-110'
                        : 'w-5 h-5 -ml-0.5 bg-[#141414] group-hover:bg-[#F2E205]'
                    }`}
                  />
                </div>

                {/* Card Content */}
                <div
                  className={`flex-grow rounded-2xl bg-white p-4 sm:p-5 border transition-all duration-300 relative shadow-sm ${
                    isActive
                      ? 'border-[#F2E205] shadow-lg ring-1 ring-[#F2E205]/40'
                      : 'border-[#141414]/10 hover:border-[#141414]/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                      {branch.year}
                    </span>
                    <span className="text-xs font-semibold text-[#555555] uppercase tracking-wider bg-[#FFFBEA] px-2.5 py-1 rounded-md border border-[#141414]/8">
                      Branch #{index + 1}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg sm:text-xl text-[#141414] mt-1.5">
                    {branch.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#555555] leading-relaxed">
                    {branch.note}
                  </p>

                  {/* Phone Number from DB */}
                  {branch.phoneNumber && (
                    <div className="mt-2 text-xs font-bold text-[#141414] bg-[#FFFBEA] py-1.5 px-3 rounded-xl border border-[#F2E205]/70 flex items-center gap-2">
                      <span>📞</span>
                      <span>{branch.phoneNumber}</span>
                    </div>
                  )}

                  {/* Actions: Call & Open Maps */}
                  <div className="mt-3.5 pt-3 border-t border-[#141414]/8 flex items-center gap-2 flex-wrap">
                    {branch.phoneNumber && (
                      <a
                        href={`tel:${branch.phoneNumber}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                        aria-label={`Call ${branch.name} at ${branch.phoneNumber}`}
                      >
                        <span>📞 Call Branch</span>
                      </a>
                    )}

                    {branch.mapUrl && (
                      <a
                        href={branch.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFBEA] hover:bg-[#F2E205] text-[#141414] font-bold text-xs border border-[#141414]/15 shadow-xs transition-colors"
                        aria-label={`Open ${branch.name} in Google Maps`}
                      >
                        <span>Open in Google Maps ↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
