import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Semantic Breadcrumb for About Us Page.
 */
export default function AboutBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
    >
      <ol className="flex items-center gap-2 text-xs sm:text-sm text-[#555555]">
        <li>
          <Link
            to="/home"
            className="hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2E205] rounded px-1.5 py-0.5 transition-colors font-medium text-[#555555] hover:underline"
          >
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-[#141414]/30 select-none">
          /
        </li>
        <li
          aria-current="page"
          className="font-semibold text-[#141414] px-1.5 py-0.5"
        >
          About Us
        </li>
      </ol>
    </nav>
  );
}
