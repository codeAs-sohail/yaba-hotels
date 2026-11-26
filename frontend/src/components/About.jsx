import React, { useEffect } from 'react';
import AboutBreadcrumb from './about/AboutBreadcrumb';
import AboutHero from './about/AboutHero';
import AboutCta from './about/AboutCta';
import ScrollReveal from './ScrollReveal';

const PILLARS = [
  {
    title: 'High-Flame Wok Craft',
    body: 'Seasoned cast-iron woks seared at high heat lock in crisp textures and signature smoky aroma.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2.5C8.7 7.2 6.5 9.8 6.5 13.2a5.5 5.5 0 0011 0c0-3.4-2.2-6-5.5-10.7z" />
      </svg>
    ),
  },
  {
    title: 'Daily Fresh Preparation',
    body: 'House-ground spices, fresh ingredients, and sauces crafted every morning in all five kitchens.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    title: 'Consistency Across Branches',
    body: 'Generous portions, honest pricing, and uniform taste whether you dine at Falaknuma or Phool Bagh.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

/**
 * Editorial About Us Page for Yaba Hotels.
 */
export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16] pb-16">
      <AboutBreadcrumb />
      <AboutHero />

      {/* Three Core Culinary Pillars */}
      <section
        aria-labelledby="values-heading"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#E6DDD2] mt-4"
      >
        <ScrollReveal className="text-center max-w-xl mx-auto mb-10">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            Our Standards
          </p>
          <h2
            id="values-heading"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916] tracking-tight"
          >
            The Heart of Every Plate
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#685F57]">
            Three promises that have brought families back to Yaba Hotels since 2002.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {PILLARS.map((pillar, idx) => (
            <ScrollReveal key={pillar.title} delay={idx * 65}>
              <div className="h-full bg-white rounded-xl p-6 sm:p-7 border border-[#E6DDD2]">
                <div className="w-10 h-10 rounded-lg bg-[#FFF6F0] border border-[#FDD2B8] text-[#E85D16] flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-serif font-semibold text-lg sm:text-xl text-[#1E1916] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#685F57] leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <AboutCta />
    </article>
  );
}
