import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Clean Breadcrumb for About Us Page.
 */
export default function AboutBreadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2"
    >
      <ol className="flex items-center gap-2 text-xs text-[#685F57]">
        <li>
          <Link to="/home" className="hover:text-[#E85D16] transition-colors">
            Home
          </Link>
        </li>
        <li aria-hidden="true" className="text-[#DED4C8]">/</li>
        <li aria-current="page" className="font-semibold text-[#1E1916]">
          About Us
        </li>
      </ol>
    </nav>
  );
}
