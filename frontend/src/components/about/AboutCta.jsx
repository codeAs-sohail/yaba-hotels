import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Captivating Chinese Food Quote & Customer Attraction Banner.
 * Replaces old "Find the Yaba nearest you" CTA with an inspiring, appetizing culinary showcase.
 */
export default function AboutCta() {
  return (
    <section
      aria-labelledby="culinary-quote-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1410] via-[#241B15] to-[#120F0D] text-[#FFFBEA] p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#F2E205]/20 text-center">
        {/* Warm ambient flame glow effects */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#E85D16]/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#F2E205]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-6 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-[#F2E205] backdrop-blur-xs border border-white/10">
            <span>🔥 The Secret of the Wok</span>
          </div>

          {/* Large Stylized Chinese Food Quote */}
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl italic font-semibold text-white leading-snug sm:leading-relaxed mb-6">
            “Good food is made with fire, but legendary fast food is born from the roar of the wok, the magic of authentic spices, and passion in every single toss.”
          </blockquote>

          {/* Customer attraction copy */}
          <p className="text-sm sm:text-base lg:text-lg text-[#FFFBEA]/85 font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
            From the sizzling crunch of Chicken 65 to our signature piping hot noodles, every recipe is crafted to bring unforgettable Chinese street flavours straight to your heart.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base text-[#141414] bg-[#F2E205] hover:bg-[#E5D500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F2E205] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Explore Our Menu
            </Link>

            <Link
              to="/branches"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white border-2 border-white/30 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white transition-all duration-200"
            >
              View City Outlets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
