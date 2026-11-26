import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearTokens } from '../features/auth/authSlice';

const navigation = [
  { name: 'Home', href: '/home' },
  { name: 'Menu', href: '/menu' },
  { name: 'Branches', href: '/branches' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About Us', href: '/about' },
  { name: 'Feedback', href: '/feedback' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.auth);

  // If leaving /owner and moving to any normal customer page, automatically log out
  useEffect(() => {
    if (access && !location.pathname.startsWith('/owner')) {
      dispatch(clearTokens());
    }
  }, [location.pathname, access, dispatch]);

  // Bypass customer navbar/footer completely on admin routes
  if (location.pathname.startsWith('/owner') || location.pathname.includes('Yaba7qK29700rest')) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#FCF9F4] font-sans text-[#1E1916] antialiased flex flex-col selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      {/* Fixed Editorial Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FCF9F4]/98 border-b border-[#E6DDD2]">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-16 sm:h-[72px] items-center justify-between">
            {/* Brand Wordmark */}
            <NavLink
              to="/home"
              className="group flex items-center gap-3 rounded-lg py-1 focus-visible:outline-none"
              aria-label="Yaba Hotels - Home"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#E85D16] text-white transition-transform duration-200 group-hover:scale-[1.03]">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2.5C8.7 7.2 6.5 9.8 6.5 13.2a5.5 5.5 0 0011 0c0-3.4-2.2-6-5.5-10.7z" />
                  <circle cx="12" cy="14" r="1.8" fill="currentColor" stroke="none" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-[21px] font-semibold text-[#1E1916] tracking-tight leading-none group-hover:text-[#E85D16] transition-colors">
                  Yaba Hotels
                </span>
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#685F57] mt-1">
                  Hyderabad • Est. 2002
                </span>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/home'}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#E85D16] font-semibold'
                        : 'text-[#1E1916] hover:text-[#E85D16]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0.5 left-3.5 right-3.5 h-[2px] bg-[#E85D16] rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1E1916] hover:text-[#E85D16] hover:bg-[#E85D16]/8 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <div
            id="mobile-menu"
            className={`md:hidden overflow-hidden transition-all duration-250 ease-out ${
              mobileMenuOpen
                ? 'max-h-[520px] opacity-100 pb-5 pt-2 border-t border-[#E6DDD2]'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="divide-y divide-[#EAE2D9]/60">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/home'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-2 py-3.5 min-h-[48px] text-[15px] transition-colors ${
                      isActive
                        ? 'text-[#E85D16] font-semibold'
                        : 'text-[#1E1916] font-medium hover:text-[#E85D16]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2.5">
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E85D16]" aria-hidden="true" />}
                        <span>{item.name}</span>
                      </span>
                      <svg
                        className={`h-4 w-4 ${isActive ? 'text-[#E85D16]' : 'text-[#685F57]/50'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-[72px] flex-grow" id="main-content" role="main">
        <Outlet />
      </main>

      {/* Editorial Dark Hospitality Footer */}
      <footer className="bg-[#181310] text-[#D8D0C8] border-t border-[#2A221D] mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          {/* Instagram Kitchen Highlight Bar */}
          <div className="rounded-xl bg-[#221B17] border border-white/8 p-4 sm:p-5 mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-white p-1.5 rounded-lg">
                  <img
                    src="/custom-images/instagram.jpeg"
                    alt="Yaba Hotels Instagram QR Code"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded"
                  />
                </div>

                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#E85D16]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>@yaba_fast_food</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-white tracking-tight">
                    Follow Our Kitchens on Instagram
                  </h3>
                  <p className="text-xs text-[#A89E96] max-w-md">
                    Scan the QR code or visit our page for daily kitchen highlights and Hyderabad specials.
                  </p>
                </div>
              </div>

              <a
                href="https://www.instagram.com/yaba_fast_food?gwpx=MXhydmU0N3dsb2xocw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white bg-[#E85D16] hover:bg-[#CC4D0D] px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>Open Instagram</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand Story */}
            <div className="sm:col-span-2 space-y-3.5">
              <NavLink
                to="/home"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none"
                aria-label="Yaba Hotels - Home"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E85D16] text-white font-serif font-semibold text-sm flex items-center justify-center">
                  Y
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-semibold text-white tracking-tight">
                    Yaba Hotels
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E85D16]">
                    Authentic Flavours Since 2002
                  </span>
                </div>
              </NavLink>

              <p className="text-xs sm:text-sm text-[#A89E96] max-w-md leading-relaxed">
                What began in 2002 as a single kitchen in Tegal Kunta has grown into one of Hyderabad’s trusted destinations for wok-tossed Indo-Chinese classics and signature fast food.
              </p>
            </div>

            {/* Navigation Links */}
            <nav aria-label="Footer navigation">
              <h4 className="font-sans text-xs font-semibold text-white uppercase tracking-[0.14em] mb-3.5">
                Explore
              </h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className="text-xs sm:text-sm text-[#A89E96] hover:text-[#E85D16] transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Hyderabad Branches */}
            <div className="space-y-2.5">
              <h4 className="font-sans text-xs font-semibold text-white uppercase tracking-[0.14em] mb-3.5">
                Our 5 Outlets
              </h4>
              <ul className="text-xs sm:text-sm text-[#A89E96] space-y-1.5">
                <li>Tegal Kunta (Falaknuma)</li>
                <li>Vattepally</li>
                <li>Shahalibanda</li>
                <li>Hafez Babanagar</li>
                <li>Phool Bagh</li>
              </ul>
              <div className="pt-2">
                <NavLink
                  to="/branches"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E85D16] hover:text-white transition-colors"
                >
                  <span>View all branches</span>
                  <span aria-hidden="true">→</span>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Bottom Legal Strip */}
          <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8D837B]">
            <p>&copy; 2002–{new Date().getFullYear()} Yaba Hotels, Hyderabad. All rights reserved.</p>
            <p className="font-medium text-[#A89E96]">Crafted Fresh Daily Across 5 Kitchens</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
