import React, { useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import FoodArcCarousel from './FoodArcCarousel';
import ScrollReveal from './ScrollReveal';
import { useGetPublicFeedbacksQuery } from '../features/dashboard/dashboardApi';

const EXPERIENCE_PILLARS = [
  {
    number: '01',
    title: 'Explore Our Menu',
    description: 'Single & full portions prepared fresh to order across all five Hyderabad outlets.',
    to: '/menu',
    cta: 'Browse Dishes',
  },
  {
    number: '02',
    title: 'Five City Kitchens',
    description: 'Serving Tegal Kunta, Vattepally, Shahalibanda, Babanagar, and Phool Bagh since 2002.',
    to: '/branches',
    cta: 'Find a Branch',
  },
  {
    number: '03',
    title: 'Inside Yaba Kitchens',
    description: 'Real dishes, fiery wok stations, and family dining rooms captured from our outlets.',
    to: '/gallery',
    cta: 'View Gallery',
  },
];

const Home = () => {
  const contentRef = useRef(null);
  const { data: publicFeedbacks = [] } = useGetPublicFeedbacksQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        y: 14,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.1,
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF9F4] selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      {/* Hero Section */}
      <section className="relative w-full overflow-x-clip pt-6 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 lg:pb-20">
        {/* Food Arc Carousel */}
        <div className="w-full flex justify-center mt-2 sm:mt-4" aria-label="Featured dishes carousel">
          <FoodArcCarousel />
        </div>

        {/* Hero Editorial Typography & Primary CTAs */}
        <div
          ref={contentRef}
          className="relative mx-auto max-w-2xl px-4 sm:px-6 text-center mt-3 sm:mt-5"
        >
          <p className="font-sans text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2.5">
            Hyderabad’s Authentic Flavours • Since 2002
          </p>

          <h1 className="font-serif text-[32px] sm:text-[42px] lg:text-[52px] font-semibold text-[#1E1916] tracking-tight leading-[1.12] mb-3.5">
            Taste the Happiness.
          </h1>

          <p className="font-sans text-[15px] sm:text-[17px] text-[#685F57] max-w-xl mx-auto leading-relaxed mb-7">
            Handcrafted dishes prepared to order — from smoky tandoors and fiery Indo-Chinese woks to Hyderabadi classics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <NavLink
              to="/menu"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 text-[15px] font-semibold text-white bg-[#E85D16] hover:bg-[#CC4D0D] rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D16] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCF9F4]"
            >
              <span>Explore Menu</span>
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NavLink>

            <NavLink
              to="/branches"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-7 text-[15px] font-semibold text-[#1E1916] bg-white border border-[#E2D8CE] hover:border-[#E85D16] hover:text-[#E85D16] rounded-lg transition-colors"
            >
              View Our 5 Branches
            </NavLink>
          </div>
        </div>
      </section>

      {/* Editorial Quick Navigation Pillars */}
      <section className="py-12 sm:py-16 border-t border-[#E6DDD2] bg-[#FAF5ED]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {EXPERIENCE_PILLARS.map((item, idx) => (
              <ScrollReveal key={item.number} delay={idx * 70}>
                <Link
                  to={item.to}
                  className="group flex flex-col justify-between h-full bg-white rounded-xl p-6 sm:p-7 border border-[#E6DDD2] hover:border-[#E85D16]/60 transition-colors"
                >
                  <div>
                    <span className="font-sans text-xs font-semibold tracking-[0.18em] text-[#E85D16]">
                      {item.number}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E1916] mt-2 mb-2 group-hover:text-[#E85D16] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-sm text-[#685F57] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#F0EAE1] inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1E1916] group-hover:text-[#E85D16] transition-colors">
                    <span>{item.cta}</span>
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Guest Reviews Section (Displayed when approved by owner) */}
      {publicFeedbacks.length > 0 && (
        <section className="py-14 sm:py-20 bg-white border-t border-[#E6DDD2]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E85D16]">
                  Guest Experiences
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1E1916] tracking-tight mt-1.5">
                  Words From Our Tables
                </h2>
              </div>
              <Link
                to="/feedback"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E1916] hover:text-[#E85D16] transition-colors"
              >
                <span>Share your experience</span>
                <span aria-hidden="true">→</span>
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {publicFeedbacks.slice(0, 6).map((fb, idx) => (
                <ScrollReveal key={fb.id} delay={idx * 60}>
                  <div className="h-full bg-[#FCF9F4] border border-[#E6DDD2] rounded-xl p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-0.5 text-[#E85D16]" aria-label={`${fb.stars} out of 5 stars`}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= fb.stars ? 'fill-current' : 'fill-[#DED4C8]'}`}
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-[#685F57] truncate max-w-[150px]">
                          {fb.branch_address ? fb.branch_address.split(',')[0] : 'Hyderabad'}
                        </span>
                      </div>

                      {fb.message ? (
                        <p className="text-sm text-[#38302A] leading-relaxed line-clamp-4">
                          “{fb.message}”
                        </p>
                      ) : (
                        <p className="text-xs text-[#685F57] italic">Rated {fb.stars} out of 5 stars</p>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[#E6DDD2] flex items-center justify-between">
                      <span className="font-serif font-medium text-sm text-[#1E1916]">
                        {fb.name || 'Guest Diner'}
                      </span>
                      <span className="text-[11px] font-medium text-[#685F57]">
                        Verified Diner
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
