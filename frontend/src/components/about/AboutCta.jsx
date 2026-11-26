import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

/**
 * Editorial Culinary Quote Banner for About Us.
 */
export default function AboutCta() {
  return (
    <section
      aria-labelledby="culinary-quote-heading"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <ScrollReveal>
        <div className="rounded-2xl bg-[#181310] text-[#FCF9F4] px-6 py-10 sm:px-12 sm:py-14 lg:py-16 border border-[#2A221D] text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#E85D16] mb-4">
              From The Kitchens
            </p>

            <blockquote
              id="culinary-quote-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl italic font-medium text-white leading-snug sm:leading-relaxed mb-5"
            >
              “Great fast food isn’t rushed — it’s born from roaring wok fire, balanced spice blends, and pride in every plate we hand across the counter.”
            </blockquote>

            <p className="text-sm sm:text-base text-[#A89E96] leading-relaxed mb-8 max-w-xl mx-auto">
              Discover why families and food lovers across Hyderabad have trusted Yaba Hotels since 2002.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/menu"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-[#E85D16] hover:bg-[#CC4D0D] transition-colors"
              >
                Explore Our Menu
              </Link>

              <Link
                to="/branches"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium text-sm sm:text-base text-white border border-white/25 hover:border-[#E85D16] hover:text-[#E85D16] transition-colors"
              >
                View City Outlets
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
