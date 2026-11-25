import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetMenusQuery,
  useGetBranchesQuery,
  useGetCategoriesQuery,
} from '../features/dashboard/dashboardApi';

/**
 * Order Online Popup Modal
 * Displays ONLY the delivery platforms configured by the owner for that particular item portion (Single vs Full).
 * Platforms: Zomato, Swiggy, Ownly.
 */
function OrderOnlineModal({ isOpen, onClose, item, branchAddress }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const platforms = item.online_platforms || item.platforms || {};
  const hasZomato = Boolean(platforms.zomato && platforms.zomato.trim());
  const hasSwiggy = Boolean(platforms.swiggy && platforms.swiggy.trim());
  const hasOwnly = Boolean(platforms.ownly && platforms.ownly.trim());
  const hasAnyPlatform = hasZomato || hasSwiggy || hasOwnly;
  const isFull = item.item_type?.toLowerCase() === 'full';
  const portionLabel = isFull ? 'Full' : 'Single';
  const priceNum = parseFloat(item.price);
  const priceStr = !isNaN(priceNum) ? `₹${Math.round(priceNum)}` : item.price;
  const itemName = item.item || item.name;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#141414]/10 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 border-b border-[#141414]/8 bg-[#FFFBEA]/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-[#141414]/10 text-[#141414] hover:bg-[#141414] hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={itemName}
                className="w-14 h-14 rounded-2xl object-cover border border-[#141414]/10 shadow-xs flex-shrink-0"
              />
            )}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E85D16]">
                  Order Online
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFull ? 'bg-[#E85D16] text-white' : 'bg-amber-400 text-[#141414]'
                }`}>
                  {portionLabel} Portion
                </span>
              </div>
              <h3 id="order-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#141414] leading-tight truncate">
                {itemName}
              </h3>
              <p className="text-xs text-[#766D65] mt-0.5 truncate">
                {priceStr} • {branchAddress ? `Branch: ${branchAddress}` : 'Yaba Fast Food'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Enabled Delivery Partner Buttons */}
        <div className="p-5 sm:p-6 space-y-3.5">
          <p className="text-xs font-semibold text-[#555555] uppercase tracking-wider">
            Choose Delivery Partner for {portionLabel} Portion
          </p>

          {hasAnyPlatform ? (
            <div className="space-y-3">
              {/* ZOMATO BUTTON */}
              {hasZomato && (
                <a
                  href={platforms.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#E23744] hover:bg-[#CB202D] text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-xs flex-shrink-0">
                      <svg viewBox="0 0 100 24" className="w-full h-auto" fill="#E23744">
                        <path d="M12.2 4.2H2.8l7.2 11.2H2.4v4.4h11.8l-7.2-11.2h7.2V4.2zm13.1 7.4c-4.3 0-7.4 3.2-7.4 7.6 0 4.4 3.1 7.6 7.4 7.6 4.3 0 7.4-3.2 7.4-7.6 0-4.4-3.1-7.6-7.4-7.6zm0 11c-2.1 0-3.5-1.7-3.5-3.4 0-1.8 1.4-3.4 3.5-3.4 2.1 0 3.5 1.7 3.5 3.4 0 1.8-1.4 3.4-3.5 3.4zm16.5-11c-2.3 0-3.9 1.2-4.6 2.6V11.8h-3.8v14.6h3.8v-8.1c0-2 1.3-3.1 2.8-3.1 1.6 0 2.6 1 2.6 2.8v8.4h3.8v-8.8c0-3.7-2-6-4.6-6zm20.8 0c-2.3 0-3.9 1.2-4.6 2.6V11.8h-3.8v14.6h3.8v-8.1c0-2 1.3-3.1 2.8-3.1 1.6 0 2.6 1 2.6 2.8v8.4h3.8v-8.8c0-3.7-2-6-4.6-6zm16.8 0c-4.4 0-7.3 3.2-7.3 7.6 0 4.4 3 7.6 7.3 7.6 2.8 0 5-1.4 6.1-3.6l-3.3-1.6c-.6 1.1-1.7 1.8-2.8 1.8-1.9 0-3.2-1.3-3.4-3h10.2c.1-.5.1-.9.1-1.4 0-4.3-2.7-7.4-6.9-7.4zm-3.4 6.2c.2-1.6 1.4-2.8 3.3-2.8 1.8 0 3 1.2 3.2 2.8h-6.5zm19.9-6.2c-2.4 0-4.2 1.3-4.9 3.1V4.2h-3.8v22.2h3.8v-1.9c.7 1.6 2.5 2.7 4.9 2.7 4.2 0 7.4-3.2 7.4-7.6 0-4.4-3.2-7.6-7.4-7.6zm-.9 11.4c-2.1 0-3.6-1.6-3.6-3.8 0-2.2 1.5-3.8 3.6-3.8 2.1 0 3.6 1.6 3.6 3.8 0 2.2-1.5 3.8-3.6 3.8z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-extrabold text-base leading-tight flex items-center gap-2">
                        <span>Order on Zomato</span>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Partner</span>
                      </div>
                      <div className="text-[11px] text-white/85 mt-0.5">Direct {portionLabel.toLowerCase()} portion on Zomato</div>
                    </div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}

              {/* SWIGGY BUTTON */}
              {hasSwiggy && (
                <a
                  href={platforms.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FC8019] hover:bg-[#E26A08] text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-xs flex-shrink-0">
                      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M24 4C14.059 4 6 12.059 6 22c0 8.04 5.309 14.84 12.637 17.155l.89.282c.42.133.722.508.756.945l.383 4.887a1.2 1.2 0 002.164.674l5.12-6.554a1.2 1.2 0 01.944-.464H29c9.941 0 18-8.059 18-18C47 12.059 38.941 4 29 4h-5zm3.2 10.5c0-1.767-1.433-3.2-3.2-3.2-1.767 0-3.2 1.433-3.2 3.2 0 1.272.742 2.37 1.815 2.883l-3.905 4.881a1.2 1.2 0 00.937 1.95h3.153v7.386a1.2 1.2 0 002.049.849l7.2-7.2a1.2 1.2 0 00-.849-2.049h-3.6v-5.617c1.073-.513 1.815-1.611 1.815-2.883z"
                          fill="#FC8019"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-extrabold text-base leading-tight flex items-center gap-2">
                        <span>Order on Swiggy</span>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Partner</span>
                      </div>
                      <div className="text-[11px] text-white/85 mt-0.5">Direct {portionLabel.toLowerCase()} portion on Swiggy</div>
                    </div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}

              {/* OWNLY BUTTON */}
              {hasOwnly && (
                <a
                  href={platforms.ownly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-xs flex-shrink-0">
                      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
                        <circle cx="24" cy="24" r="22" fill="#EEF2FF" />
                        <path
                          d="M14 26a5 5 0 100-10 5 5 0 000 10zm20 0a5 5 0 100-10 5 5 0 000 10zM19 21h10M24 16v10M17 32h14a2 2 0 002-2v-2H15v2a2 2 0 002 2z"
                          stroke="#4F46E5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-extrabold text-base leading-tight flex items-center gap-2">
                        <span>Order on Ownly</span>
                        <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Direct Order</span>
                      </div>
                      <div className="text-[11px] text-indigo-100 mt-0.5">
                        Direct {portionLabel.toLowerCase()} portion via Ownly
                      </div>
                    </div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-3xl block mb-2">🛵</span>
              <p className="text-sm font-semibold text-[#141414]">
                Online ordering links currently unavailable
              </p>
              <p className="text-xs text-[#766D65] mt-1">
                This {portionLabel.toLowerCase()} portion is currently available for direct dine-in and counter takeaway at our branch.
              </p>
            </div>
          )}

          {/* Modal Footer helper */}
          <div className="pt-2 text-center text-[11px] text-[#766D65]">
            Opens the official {portionLabel.toLowerCase()} ordering page in a new window.
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Menu Item Card
 * Distinctly displays portion (Single vs Full), image, name, description, individual price, and direct "Order Online" button.
 */
function MenuItemCard({ item, onOrderOnline }) {
  const platforms = item.online_platforms || item.platforms || {};
  const hasZomato = Boolean(platforms.zomato && platforms.zomato.trim());
  const hasSwiggy = Boolean(platforms.swiggy && platforms.swiggy.trim());
  const hasOwnly = Boolean(platforms.ownly && platforms.ownly.trim());
  const canOrderOnline = hasZomato || hasSwiggy || hasOwnly;

  const priceNum = parseFloat(item.price);
  const priceStr = !isNaN(priceNum) ? `₹${Math.round(priceNum)}` : item.price;
  const isFull = item.item_type?.toLowerCase() === 'full';
  const portionLabel = isFull ? 'Full' : 'Single';
  const itemName = item.item || item.name;

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#141414]/10 hover:border-[#141414]/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Item Image with Consistent Aspect Ratio (16:10) */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-[#FFF8F0] mb-4 border border-[#141414]/6">
          {item.image ? (
            <img
              src={item.image}
              alt={itemName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}

          {/* Fallback Placeholder */}
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0] text-[#766D65]"
            style={{ display: item.image ? 'none' : 'flex' }}
          >
            <span className="text-3xl mb-1">🥢</span>
            <span className="font-serif text-xs font-bold text-[#141414]/60 uppercase tracking-widest">
              Yaba Fast Food
            </span>
          </div>

          {/* Category Tag Overlay */}
          {item.category_name && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#141414]/85 text-[#F2E205] backdrop-blur-xs shadow-xs">
              {item.category_name}
            </span>
          )}

          {/* Portion Badge Overlay (Single vs Full) */}
          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-xs backdrop-blur-xs ${
              isFull
                ? 'bg-[#E85D16] text-white'
                : 'bg-amber-400 text-[#141414]'
            }`}
          >
            {portionLabel} Portion
          </span>
        </div>

        {/* Item Name & Portion */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#141414] leading-tight group-hover:text-[#E85D16] transition-colors">
            {itemName}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#555555] leading-relaxed line-clamp-2 mb-4">
          {item.description || 'Authentic spices and wok-tossed perfection, prepared fresh to order.'}
        </p>
      </div>

      {/* Pricing & Order Online Footer */}
      <div className="pt-3 border-t border-[#141414]/8 space-y-3">
        {/* Specific portion price */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#141414]">
              {priceStr}
            </span>
            <span className="text-xs text-[#766D65] font-semibold">
              ({portionLabel})
            </span>
          </div>
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isFull
                ? 'bg-orange-50 text-[#E85D16] border border-orange-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {portionLabel}
          </span>
        </div>

        {/* Distinctive "Order Online" Button with Partner Badges */}
        {canOrderOnline ? (
          <button
            type="button"
            onClick={() => onOrderOnline(item)}
            className="w-full bg-[#141414] hover:bg-black active:bg-zinc-900 text-white font-bold text-xs sm:text-sm py-2.5 px-3.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span>Order {portionLabel} Online</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {hasZomato && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#E23744] text-[10px] font-extrabold text-white leading-none shadow-2xs" title="Available on Zomato">
                  Zomato
                </span>
              )}
              {hasSwiggy && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#FC8019] text-[10px] font-extrabold text-white leading-none shadow-2xs" title="Available on Swiggy">
                  Swiggy
                </span>
              )}
              {hasOwnly && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#4F46E5] text-[10px] font-extrabold text-white leading-none shadow-2xs" title="Available on Ownly">
                  Ownly
                </span>
              )}
            </div>
          </button>
        ) : (
          <div className="text-center py-2 px-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] font-medium text-gray-400 italic">
            Dine-in & Takeaway Only
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Customer Menu Page Component
 */
export default function CustomerMenu() {
  const { branchId: paramBranchId } = useParams();
  const navigate = useNavigate();

  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  // References for sticky categories scroll sync
  const categoryScrollRef = useRef(null);

  // Fetch all branches
  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();

  // Resolve current active branch
  const activeBranchId = useMemo(() => {
    if (paramBranchId && paramBranchId !== 'undefined' && paramBranchId !== 'null') {
      return paramBranchId;
    }
    if (branches.length > 0) return String(branches[0].id);
    return 'all';
  }, [paramBranchId, branches]);

  const currentBranch = useMemo(() => {
    return branches.find((b) => String(b.id) === String(activeBranchId)) || branches[0];
  }, [branches, activeBranchId]);

  // Fetch menus strictly for the active branch
  const {
    data: rawMenuItems = [],
    isLoading: loadingMenu,
    isError,
    error,
    refetch,
  } = useGetMenusQuery(activeBranchId);

  // Fetch categories dynamically from Category API
  const { data: categories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    if (currentBranch) {
      document.title = `${currentBranch.address} Menu | Yaba Fast Food`;
    } else {
      document.title = 'Restaurant Menu | Yaba Fast Food';
    }
    window.scrollTo(0, 0);
  }, [currentBranch]);

  // Handle branch switching
  const handleBranchChange = (newBranchId) => {
    navigate(`/menu/${newBranchId}`);
  };

  // Instead of merging Single and Full into one card, keep them distinct
  // Sort items so dishes with the same name are together, Single first then Full
  // Each Single and Full dish has its own distinct card, individual price, and direct delivery links!
  const processedMenuItems = useMemo(() => {
    if (!rawMenuItems || rawMenuItems.length === 0) return [];
    return [...rawMenuItems].sort((a, b) => {
      const nameComp = (a.item || '').localeCompare(b.item || '');
      if (nameComp !== 0) return nameComp;
      const typeA = (a.item_type || 'single').toLowerCase();
      const typeB = (b.item_type || 'single').toLowerCase();
      if (typeA === 'single' && typeB === 'full') return -1;
      if (typeA === 'full' && typeB === 'single') return 1;
      return 0;
    });
  }, [rawMenuItems]);

  // Build category grouping for "All" view
  const categoriesWithItems = useMemo(() => {
    return categories
      .map((cat) => {
        const items = processedMenuItems.filter(
          (m) => String(m.category) === String(cat.id)
        );
        return {
          ...cat,
          items,
        };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, processedMenuItems]);

  // Filtered items when a specific category is selected
  const activeCategoryItems = useMemo(() => {
    if (activeCategoryId === 'all') return [];
    return processedMenuItems.filter(
      (m) => String(m.category) === String(activeCategoryId)
    );
  }, [processedMenuItems, activeCategoryId]);

  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => String(c.id) === String(activeCategoryId));
  }, [categories, activeCategoryId]);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#141414] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      {/* Background paper texture pattern */}
      <div
        className="w-full pb-24"
        style={{
          backgroundImage: 'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="pb-3">
            <ol className="flex items-center gap-2 text-xs text-[#555555]">
              <li>
                <Link to="/home" className="hover:text-[#141414] transition-colors hover:underline">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#141414]/30 select-none">/</li>
              <li aria-current="page" className="font-semibold text-[#141414]">
                Menu
              </li>
              {currentBranch && (
                <>
                  <li aria-hidden="true" className="text-[#141414]/30 select-none">/</li>
                  <li className="text-[#766D65] truncate font-medium">
                    {currentBranch.address}
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Restaurant Branding & Header Section */}
          <header className="text-center max-w-3xl mx-auto pt-2 pb-6 sm:pb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#141414] text-[#F2E205] mb-3 shadow-xs">
              🥢 YABA FAST FOOD
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#141414] tracking-tight leading-tight">
              Restaurant Menu
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-[#555555] max-w-xl mx-auto leading-relaxed">
              Authentic flavours, freshly prepared for every craving.
            </p>

            {/* Clean Branch Selector Bar */}
            {branches.length > 0 && (
              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 p-1.5 bg-white rounded-2xl border border-[#141414]/10 shadow-xs">
                <span className="text-xs font-bold text-[#766D65] pl-2 flex items-center gap-1">
                  <span>📍</span> Outlet:
                </span>
                <select
                  value={activeBranchId}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  disabled={loadingBranches}
                  className="bg-[#FFF8F0] border border-[#141414]/15 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-[#141414] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E85D16] transition-all"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.address}
                    </option>
                  ))}
                </select>
                <Link
                  to="/branches"
                  className="text-xs font-semibold text-[#E85D16] hover:underline px-2"
                >
                  View Map ↗
                </Link>
              </div>
            )}
          </header>

          {/* Sticky Category Navigation Bar (All + Dynamic Categories) */}
          <div className="sticky top-[68px] sm:top-[72px] z-40 bg-[#FFF8F0]/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-[#141414]/8 mb-8 sm:mb-10 transition-all">
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none scroll-smooth pb-0.5 max-w-7xl mx-auto"
            >
              {/* "All" Button */}
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs ${
                  activeCategoryId === 'all'
                    ? 'bg-[#141414] text-[#F2E205] shadow-sm scale-102'
                    : 'bg-white text-[#555555] border border-[#141414]/12 hover:border-[#141414]/30 hover:bg-[#FFFBEA]'
                }`}
              >
                All
              </button>

              {/* Dynamic Categories */}
              {categories.map((cat) => {
                const isActive = String(activeCategoryId) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(String(cat.id))}
                    className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap ${
                      isActive
                        ? 'bg-[#141414] text-[#F2E205] shadow-sm scale-102'
                        : 'bg-white text-[#555555] border border-[#141414]/12 hover:border-[#141414]/30 hover:bg-[#FFFBEA]'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading Skeletons */}
          {loadingMenu && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-5 border border-[#141414]/10 animate-pulse space-y-4"
                >
                  <div className="w-full aspect-[16/10] bg-gray-200 rounded-2xl" />
                  <div className="h-6 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-red-200 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
                ⚠️
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                Failed to Load Menu
              </h2>
              <p className="text-sm text-[#555555] mt-2 mb-6">
                {error?.data?.detail || error?.error || 'Unable to retrieve dishes for this branch.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[#141414] text-[#F2E205] hover:bg-black transition-all shadow-md active:scale-95 cursor-pointer"
              >
                ↻ Retry Loading Menu
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingMenu && !isError && processedMenuItems.length === 0 && (
            <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 sm:p-14 border border-[#141414]/10 shadow-xs text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
                🍜
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#141414]">
                No Dishes Available Right Now
              </h2>
              <p className="text-sm text-[#555555] mt-2 mb-6">
                We are refreshing the menu items for this branch. Please choose another branch or check back shortly.
              </p>
            </div>
          )}

          {/* VIEW 1: "ALL" Selected -> Grouped by Category Headings */}
          {!loadingMenu && !isError && activeCategoryId === 'all' && categoriesWithItems.length > 0 && (
            <div className="space-y-12 sm:space-y-16">
              {categoriesWithItems.map((category) => (
                <section
                  key={category.id}
                  id={`cat-section-${category.id}`}
                  className="scroll-mt-28"
                >
                  {/* Category Section Header with subtle separator */}
                  <div className="flex items-center gap-4 mb-6 sm:mb-8">
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
                      {category.name}
                    </h2>
                    <div className="h-px bg-gradient-to-r from-[#141414]/20 via-[#141414]/10 to-transparent flex-grow" />
                    <span className="text-xs font-bold text-[#766D65] px-3 py-1 rounded-full bg-white border border-[#141414]/10 shadow-xs">
                      {category.items.length} {category.items.length === 1 ? 'Dish' : 'Dishes'}
                    </span>
                  </div>

                  {/* 2 Items Per Row Responsive Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {category.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onOrderOnline={(it) => setSelectedOrderItem(it)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* VIEW 2: Specific Category Selected -> Displays Only That Category's Items */}
          {!loadingMenu && !isError && activeCategoryId !== 'all' && (
            <div>
              {/* Category Header */}
              <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-[#141414]/10">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight">
                    {activeCategoryObj?.name || 'Category'}
                  </h2>
                  <p className="text-xs text-[#766D65] mt-1">
                    Showing all items under this category
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCategoryId('all')}
                  className="text-xs font-bold text-[#E85D16] hover:underline"
                >
                  View All Categories →
                </button>
              </div>

              {/* 2 Items Per Row Grid */}
              {activeCategoryItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {activeCategoryItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onOrderOnline={(it) => setSelectedOrderItem(it)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#141414]/10 p-8 max-w-lg mx-auto">
                  <span className="text-3xl block mb-2">🍽️</span>
                  <h3 className="font-serif text-lg font-bold text-[#141414]">
                    No items in this category yet
                  </h3>
                  <p className="text-xs text-[#766D65] mt-1 mb-4">
                    Try selecting another category or view all dishes.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveCategoryId('all')}
                    className="px-4 py-2 rounded-xl bg-[#141414] text-[#F2E205] text-xs font-bold"
                  >
                    Back to All Dishes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modern Order Online Modal */}
      <OrderOnlineModal
        isOpen={Boolean(selectedOrderItem)}
        onClose={() => setSelectedOrderItem(null)}
        item={selectedOrderItem}
        branchAddress={currentBranch?.address}
      />
    </div>
  );
}