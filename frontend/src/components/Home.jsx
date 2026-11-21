import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import FoodArcCarousel from './FoodArcCarousel';

const Home = () => {
  const contentRef = useRef(null);

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
    </div>
  );
};

export default Home;
