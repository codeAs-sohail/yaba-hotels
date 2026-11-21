import React, { useState, useEffect, useRef } from 'react';
import { getBranchStats } from '../../data/branchesData';

/**
 * Hero & Legacy section for About Us page.
 * Uses jabatables.peg with modern rounded borders, balanced grid spacing,
 * rich culinary feature tags, and animated count-up statistics.
 */
export default function AboutHero() {
  const stats = getBranchStats();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    years: 0,
    branches: 0,
    foundingYear: stats.foundingYear
  });

  const statsRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setCounts({
        years: stats.legacyYears,
        branches: stats.branchCount,
        foundingYear: stats.foundingYear
      });
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1400; // ms
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              years: Math.round(easeOut * stats.legacyYears),
              branches: Math.round(easeOut * stats.branchCount),
              foundingYear: stats.foundingYear
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, stats.legacyYears, stats.branchCount, stats.foundingYear]);

  return (
    <section
      aria-labelledby="hero-legacy-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column (Desktop) / Top (Mobile): Featured Table Ambiance Photo */}
        <div className="lg:col-span-6 order-1 lg:order-1">
          <div className="relative group p-2.5 sm:p-3.5 bg-white/70 backdrop-blur-md rounded-3xl sm:rounded-[36px] border border-[#141414]/12 shadow-[0_16px_45px_rgba(20,20,20,0.08)] transition-all duration-300 hover:shadow-[0_20px_55px_rgba(20,20,20,0.12)]">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] aspect-[4/3] sm:aspect-[16/11] bg-[#141414]/5">
              <img
                src="/custom-images/jabatables.peg"
                alt="Yaba Fast Food dining ambiance and tables in Hyderabad"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="eager"
              />
              {/* Subtle warm overlay gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#141414]/70 via-[#141414]/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              
              {/* Floating badges on photo */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-[#FFFBEA]/95 text-[#141414] font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-xs border border-[#141414]/10">
                  <span className="h-2 w-2 rounded-full bg-[#E85D16] animate-pulse" />
                  Dine-In &amp; Takeaway
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium drop-shadow-md flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#F2E205] text-[#141414] font-bold px-2.5 py-0.5 rounded-full text-xs">
                    Est. {stats.foundingYear}
                  </span>
                  <span>Hyderabad’s Flavour Destination</span>
                </div>
                <span className="text-white/80 text-xs hidden sm:inline">
                  Hot • Fast • Fresh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Desktop) / Bottom (Mobile): Legacy Story & Stats */}
        <div className="lg:col-span-6 order-2 lg:order-2 flex flex-col justify-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-[#F2E205] ring-4 ring-[#F2E205]/20" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#141414]/75">
              Taste &amp; Trust Since {stats.foundingYear}
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-legacy-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141414] tracking-tight leading-[1.18] mb-5"
          >
            A Legacy of {stats.legacyYears} Years
          </h1>

          {/* Copy paragraphs */}
          <div className="space-y-4 text-[#141414]/85 text-base sm:text-lg leading-relaxed font-sans">
            <p>
              Since {stats.foundingYear},{' '}
              <strong className="font-bold text-[#141414]">Yaba Fast Food</strong>{' '}
              has been serving Hyderabad hot, flavour-packed{' '}
              <strong className="font-bold text-[#141414]">Chinese fast food</strong>
              , made the way you like it and{' '}
              <strong className="font-bold text-[#141414]">consistent</strong>{' '}
              every single time. What began as a single outlet in Tegal Kunta has
              grown into {stats.branchCount} branches across the city.
            </p>

            <p>
              At Yaba,{' '}
              <strong className="font-bold text-[#141414]">taste and trust</strong>{' '}
              go hand in hand. From our noodles and fried rice to crowd favourites
              like Chicken 65, Manchurian and Lollipop, every plate is cooked fresh,
              priced fairly and served with a smile.
            </p>

            <p className="text-[#555555] italic text-sm sm:text-base">
              Every branch keeps the same promise: the flavour you remember, every
              visit.
            </p>
          </div>

          {/* Modern UI Feature Highlights (Filling whitespace nicely) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 my-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#141414]/10 text-[#141414] shadow-xs hover:border-[#141414]/20 transition-colors">
              <span className="text-[#E85D16]">🔥</span> Wok-Hei Tossed
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#141414]/10 text-[#141414] shadow-xs hover:border-[#141414]/20 transition-colors">
              <span className="text-[#B94720]">🍗</span> Crispy Chicken 65
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#141414]/10 text-[#141414] shadow-xs hover:border-[#141414]/20 transition-colors">
              <span className="text-[#F2E205] text-[15px]">★</span> 100% Fresh Daily
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#141414]/10 text-[#141414] shadow-xs hover:border-[#141414]/20 transition-colors">
              <span className="text-[#E85D16]">⚡</span> Super Fast Service
            </span>
          </div>

          {/* Animated Stats Row */}
          <div
            ref={statsRef}
            className="pt-6 border-t border-[#141414]/10 grid grid-cols-3 gap-3 sm:gap-5"
            aria-label="Yaba Fast Food Key Statistics"
          >
            {/* Stat 1: Years */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#141414]/8 shadow-xs text-center sm:text-left transition-transform hover:-translate-y-0.5 duration-200">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141414] tracking-tight">
                {counts.years}+
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#555555] uppercase tracking-wider mt-1">
                Years of Legacy
              </div>
            </div>

            {/* Stat 2: Branches */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#141414]/8 shadow-xs text-center sm:text-left transition-transform hover:-translate-y-0.5 duration-200">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141414] tracking-tight">
                {counts.branches}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#555555] uppercase tracking-wider mt-1">
                City Outlets
              </div>
            </div>

            {/* Stat 3: Founding Year */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 sm:p-4 border border-[#141414]/8 shadow-xs text-center sm:text-left transition-transform hover:-translate-y-0.5 duration-200">
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141414] tracking-tight">
                {stats.foundingYear}
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-[#555555] uppercase tracking-wider mt-1">
                Since {stats.foundingYear}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
