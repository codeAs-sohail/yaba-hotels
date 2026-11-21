import React, { useEffect } from 'react';
import AboutBreadcrumb from './about/AboutBreadcrumb';
import AboutHero from './about/AboutHero';
import AboutCta from './about/AboutCta';

/**
 * Concise, modern "About Us" page for Yaba Fast Food.
 * Branch chart moved to the Branches page as requested.
 * Focuses on heritage, culinary passion, core values, and customer attraction.
 */
export default function About() {
  useEffect(() => {
    document.title = 'About Us | Yaba Fast Food — Chinese Street Food in Hyderabad';
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-[#FFFBEA] text-[#141414] font-sans selection:bg-[#F2E205] selection:text-[#141414]">
      {/* Paper-like subtle dot texture overlay */}
      <div
        className="w-full"
        style={{
          backgroundImage:
            'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Breadcrumb Navigation */}
        <AboutBreadcrumb />

        {/* Hero / Legacy Section with jabatables.peg and rounded borders */}
        <AboutHero />

        {/* Our Culinary Pillars (Concise high-impact content) */}
        <section
          aria-labelledby="values-heading"
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2
              id="values-heading"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight"
            >
              The Heart of Every Plate
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#555555]">
              Three promises that have kept Hyderabad coming back to Yaba since 2002.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-[#141414]/8 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FFFBEA] border border-[#F2E205] flex items-center justify-center text-xl mb-4">
                🔥
              </div>
              <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
                Roaring Wok Mastery
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                High-heat cooking that locks in that unmistakable wok-hei aroma, crispy veggies, and tender proteins.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-[#141414]/8 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FFFBEA] border border-[#F2E205] flex items-center justify-center text-xl mb-4">
                🌿
              </div>
              <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
                Fresh Spices &amp; Sauces
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                Hand-blended spice mixes and house-crafted sauces made daily for bold, punchy Indo-Chinese flavor.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-[#141414]/8 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#FFFBEA] border border-[#F2E205] flex items-center justify-center text-xl mb-4">
                🤝
              </div>
              <h3 className="font-serif font-bold text-lg text-[#141414] mb-2">
                Taste &amp; Trust
              </h3>
              <p className="text-sm text-[#555555] leading-relaxed">
                Generous portions, pocket-friendly prices, and the same authentic flavour across every single branch.
              </p>
            </div>
          </div>
        </section>

        {/* Captivating Chinese Food Quote & Attraction Section */}
        <AboutCta />
      </div>
    </article>
  );
}
