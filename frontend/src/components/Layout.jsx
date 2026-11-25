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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is open
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

  // Close on Escape key
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

  // If on the owner admin dashboard or secret login page, bypass customer navbar and footer completely
  if (location.pathname.startsWith('/owner') || location.pathname.includes('Yaba7qK29700rest')) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans text-[#29211C] antialiased flex flex-col selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/92 backdrop-blur-md border-b border-[#29211C]/8 transition-colors duration-300">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex h-[68px] sm:h-[72px] items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center">
              <NavLink
                to="/home"
                className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D16] focus-visible:ring-offset-2 rounded-lg"
                aria-label="Yaba Hotels - Home"
              >
                {/* Refined Hospitality Emblem */}
                <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E85D16] to-[#B94720] shadow-[0_4px_12px_rgba(232,93,22,0.25)] transition-transform duration-300 group-hover:scale-105">
                  <svg
                    className="h-6 w-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {/* Contemporary flame / cloche / hospitality insignia */}
                    <path d="M12 2C8.5 7 6 9.5 6 13a6 6 0 0012 0c0-3.5-2.5-6-6-11z" />
                    <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" fill="currentColor" stroke="none" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-[22px] font-semibold text-[#29211C] tracking-tight leading-none group-hover:text-[#E85D16] transition-colors duration-200">
                    Yaba Hotels
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-[#766D65] mt-1">
                    Authentic Dining
                  </span>
                </div>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-1.5 lg:gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 text-[14.5px] font-medium transition-all duration-200 rounded-lg ${
                      isActive
                        ? 'text-[#E85D16] font-semibold'
                        : 'text-[#29211C] hover:text-[#E85D16] hover:bg-[#E85D16]/5'
                    }`
                  }
                  end={item.href === '/home'}
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <span
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-5 bg-[#E85D16] rounded-full transition-all duration-300"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2.5 rounded-xl text-[#29211C] hover:text-[#E85D16] hover:bg-[#E85D16]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D16] transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {mobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer / Slide-Down */}
          <div
            id="mobile-menu"
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen
                ? 'max-h-[460px] opacity-100 pb-5 pt-2 border-t border-[#29211C]/8'
                : 'max-h-0 opacity-0 pointer-events-none'
            }`}
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1.5 pt-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 text-[15px] font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-[#E85D16] bg-[#E85D16]/10 font-semibold'
                        : 'text-[#29211C] hover:text-[#E85D16] hover:bg-[#E85D16]/5'
                    }`
                  }
                  end={item.href === '/home'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  <svg
                    className="h-4 w-4 text-[#766D65]/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="pt-[68px] sm:pt-[72px] flex-grow" id="main-content" role="main">
        <Outlet />
      </main>

      {/* Minimal, Authentic Restaurant Footer */}
      <footer className="bg-[#181310] text-[#D8D2CD] border-t border-[#29211C]/30 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Top section: Sleek Compact Instagram Scanner banner */}
          <div className="bg-[#241D18] rounded-2xl p-3 sm:p-4 border border-white/5 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
              <div className="flex items-center gap-3.5">
                {/* Compact Instagram QR Scanner */}
                <div className="flex-shrink-0 bg-white p-1.5 rounded-xl shadow-xs border border-white/10">
                  <img
                    src="/custom-images/instagram.jpeg"
                    alt="Yaba Fast Food Instagram QR"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg"
                  />
                </div>

                {/* Unique Compact Instagram Copy */}
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#E85D16]">
                    <span>📸</span>
                    <span>@yaba_fast_food</span>
                  </div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                    Follow Our Kitchen on Instagram
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#A89F97] line-clamp-1 max-w-lg">
                    Scan QR or visit to view live wok-tossing and daily authentic Hyderabad specials.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                <a
                  href="https://www.instagram.com/yaba_fast_food?gwpx=MXhydmU0N3dsb2xocw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#E85D16] hover:bg-[#B94720] px-3.5 py-1.5 rounded-lg transition-colors shadow-xs whitespace-nowrap"
                >
                  <span>Open Instagram</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
            {/* Brand story */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <NavLink
                to="/home"
                className="inline-flex items-center gap-2.5 focus-visible:outline-none"
                aria-label="Yaba Fast Food - Home"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E85D16] text-white font-serif font-black text-sm flex items-center justify-center">
                  YB
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-white tracking-tight">
                    Yaba Fast Food
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#E85D16]">
                    Authentic Flavours Since 2002
                  </span>
                </div>
              </NavLink>

              <p className="text-xs sm:text-sm text-[#A89F97] max-w-md leading-relaxed">
                What began in 2002 as a single flame in Tegal Kunta is now Hyderabad's favorite Chinese and fast food stop. Hot woks, fresh ingredients, and genuine street flavors served every day.
              </p>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer navigation">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className="text-xs sm:text-sm text-[#A89F97] hover:text-[#E85D16] transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Outlets Directory */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Our 5 Outlets
              </h4>
              <div className="text-xs sm:text-sm text-[#A89F97] space-y-1.5 leading-relaxed">
                <p>Tegal Kunta</p>
                <p>Vattepally</p>
                <p>Shahalibanda</p>
                <p>Babanagar</p>
                <p>Phool Bagh</p>
                <div className="pt-1">
                  <NavLink
                    to="/branches"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#E85D16] hover:underline"
                  >
                    <span>View all branches</span>
                    <span>→</span>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#766D65]">
            <p>&copy; 2002–{new Date().getFullYear()} Yaba Fast Food, Hyderabad. All rights reserved.</p>
            <p className="font-medium text-[#A89F97]">Taste &amp; Trust in Every Dish</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
