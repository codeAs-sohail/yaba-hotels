import React, { useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import FoodArcCarousel from './FoodArcCarousel';
import { useGetPublicFeedbacksQuery } from '../features/dashboard/dashboardApi';

const Home = () => {
  const contentRef = useRef(null);
  const { data: publicFeedbacks = [] } = useGetPublicFeedbacksQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // Subtle, sophisticated entrance animation for hero typography and CTA
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      {/* Hero Section: Centered arc carousel at top with generous margin and editorial typography directly below */}
      <section className="relative w-full overflow-x-hidden pt-8 sm:pt-14 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
        {/* Food Arc Carousel - Primary Visual Attraction with comfortable top margin */}
        <div className="w-full flex justify-center mt-3 sm:mt-6 lg:mt-8" aria-label="Featured dishes carousel">
          <FoodArcCarousel />
        </div>

        {/* Hero Content: Playfair Editorial Heading, DM Sans Tagline & Orange CTA */}
        <div
          ref={contentRef}
          className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center mt-3 sm:mt-4 lg:mt-5"
        >
          {/* Main Heading - Playfair Display (52–60px desktop, 34–40px mobile) */}
          <h1 className="font-serif text-[34px] sm:text-[42px] md:text-[50px] lg:text-[56px] font-semibold text-[#29211C] tracking-tight leading-[1.12] mb-3.5 sm:mb-4">
            Taste the Happiness.
          </h1>

          {/* Description - DM Sans (17–19px desktop, 14–16px mobile) */}
          <p className="font-sans text-[15px] sm:text-[17px] lg:text-[18.5px] text-[#766D65] max-w-2xl mx-auto leading-relaxed mb-7 sm:mb-8">
            Handcrafted dishes made with love — from smoky tandoors to authentic biryanis, every bite is a celebration.
          </p>

          {/* Explore Menu CTA Button */}
          <div className="flex justify-center">
            <NavLink
              to="/menu"
              className="group inline-flex items-center justify-center gap-2.5 h-[52px] sm:h-[56px] px-8 sm:px-9 text-[15px] sm:text-[16px] font-medium sm:font-semibold text-white bg-[#E85D16] hover:bg-[#B94720] rounded-xl shadow-[0_8px_20px_rgba(232,93,22,0.22)] hover:shadow-[0_12px_28px_rgba(232,93,22,0.30)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0]"
            >
              <span>Explore Menu</span>
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Verified Guest Reviews Section (Visible only when reviews are approved by admin) */}
      {publicFeedbacks.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-[#29211C]/8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E85D16] bg-[#E85D16]/10 px-3 py-1 rounded-full">
                  ★ Genuine Guest Reviews
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29211C] tracking-tight mt-2.5">
                  What Our Guests Say
                </h2>
              </div>
              <Link
                to="/feedback"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#29211C] hover:text-[#E85D16] transition-colors"
              >
                <span>Share your experience</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {publicFeedbacks.slice(0, 6).map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#FFFDF3] border border-[#F3E8B5] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center text-amber-400 text-sm">
                        {'★'.repeat(fb.stars)}{'☆'.repeat(5 - fb.stars)}
                      </div>
                      <span className="text-[11px] text-[#766D65] font-medium">
                        📍 {fb.branch_address ? fb.branch_address.split(',')[0] : 'Hyderabad'}
                      </span>
                    </div>

                    {fb.message ? (
                      <p className="text-sm text-[#3E342B] leading-relaxed italic line-clamp-4">
                        "{fb.message}"
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Rated {fb.stars} stars</p>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#29211C]">
                      {fb.name || 'Valued Guest'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Diner
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
