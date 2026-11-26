import React, { useState, useEffect, useRef } from 'react';
import { getBranchStats } from '../../data/branchesData';
import ScrollReveal from '../ScrollReveal';

/**
 * Editorial Legacy Hero section for About Us.
 */
export default function AboutHero() {
  const stats = getBranchStats();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    years: stats.legacyYears,
    branches: stats.branchCount,
    foundingYear: stats.foundingYear,
  });

  const statsRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 950;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setCounts({
              years: Math.max(1, Math.round(easeOut * stats.legacyYears)),
              branches: Math.max(1, Math.round(easeOut * stats.branchCount)),
              foundingYear: stats.foundingYear,
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, stats.legacyYears, stats.branchCount, stats.foundingYear]);

  return (
    <section
      aria-labelledby="hero-legacy-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Framed Kitchen & Dining Photo */}
        <ScrollReveal className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-xl border border-[#E6DDD2] bg-[#F7F2EA] aspect-[4/3] sm:aspect-[16/11]">
            <img
              src="/custom-images/jabatables.jpeg"
              alt="Yaba Hotels family dining hall in Hyderabad"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#1E1916]/65 via-transparent to-transparent pointer-events-none"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium flex items-center justify-between gap-2">
              <span className="inline-block bg-[#E85D16] text-white font-semibold px-2.5 py-0.5 rounded text-xs">
                Est. {stats.foundingYear}
              </span>
              <span className="text-white/90 text-xs">Dine-In &amp; Takeaway Across Hyderabad</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Legacy Copy & Editorial Stats */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2.5">
            Taste &amp; Trust Since {stats.foundingYear}
          </p>

          <h1
            id="hero-legacy-heading"
            className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-[1.15] mb-5"
          >
            A Legacy of {stats.legacyYears} Years
          </h1>

          <div className="space-y-4 text-[#38302A] text-sm sm:text-base leading-relaxed">
            <p>
              Since {stats.foundingYear},{' '}
              <strong className="font-semibold text-[#1E1916]">Yaba Hotels</strong>{' '}
              has been serving Hyderabad hot, flavour-packed{' '}
              <strong className="font-semibold text-[#1E1916]">Chinese fast food</strong>{' '}
              and regional specials prepared consistently every single day. What began as a single outlet in Tegal Kunta has grown into {stats.branchCount} thriving branches across the city.
            </p>

            <p>
              At Yaba, taste and trust go hand in hand. From our signature Chicken 65 and smoky Chicken Tandoori to freshly tossed noodles and fried rice, every dish is cooked fresh, priced honestly, and served with care.
            </p>

            <p className="text-[#685F57] italic text-sm">
              Every outlet keeps the same promise: the unmistakable flavour you remember, on every visit.
            </p>
          </div>

          {/* Clean 3-Column Metrics */}
          <div
            ref={statsRef}
            className="mt-8 pt-6 border-t border-[#E6DDD2] grid grid-cols-3 gap-4"
            aria-label="Yaba Hotels Key Statistics"
          >
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916] tabular-nums">
                {counts.years}+
              </div>
              <div className="text-[11px] font-semibold text-[#685F57] uppercase tracking-[0.12em] mt-1">
                Years Legacy
              </div>
            </div>

            <div>
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#E85D16] tabular-nums">
                {counts.branches}
              </div>
              <div className="text-[11px] font-semibold text-[#685F57] uppercase tracking-[0.12em] mt-1">
                City Outlets
              </div>
            </div>

            <div>
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916] tabular-nums">
                {stats.foundingYear}
              </div>
              <div className="text-[11px] font-semibold text-[#685F57] uppercase tracking-[0.12em] mt-1">
                Founded
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
