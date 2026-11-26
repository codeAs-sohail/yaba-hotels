import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useGetMenusQuery,
  useGetBranchesQuery,
  useGetCategoriesQuery,
} from '../features/dashboard/dashboardApi';
import { resolveImageUrl } from '../api/config';
import ScrollReveal from './ScrollReveal';

/**
 * Order Online Popup Modal
 * Displays ONLY the delivery platforms configured by the owner for that specific dish portion.
 * Signature Pink (#DB2777) highlights the Order Online flow exclusively.
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1E1916]/60 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-[#E6DDD2] overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 border-b border-[#E6DDD2] bg-[#FCF9F4]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-white border border-[#E6DDD2] text-[#1E1916] hover:border-[#1E1916] flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3.5">
            {item.image && (
              <img
                src={resolveImageUrl(item.image)}
                alt={itemName}
                className="w-14 h-14 rounded-lg object-cover border border-[#E6DDD2] flex-shrink-0"
              />
            )}
            <div className="pr-9 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    hasAnyPlatform ? 'text-[#DB2777]' : 'text-[#685F57]'
                  }`}
                >
                  {hasAnyPlatform ? 'Order Online' : 'Order Offline'}
                </span>
                <span className="text-[#DED4C8]">•</span>
                <span className="text-[11px] font-semibold text-[#1E1916]">
                  {portionLabel} Portion
                </span>
              </div>
              <h3 id="order-modal-title" className="font-serif text-xl font-semibold text-[#1E1916] leading-tight truncate">
                {itemName}
              </h3>
              <p className="text-xs text-[#685F57] mt-0.5 truncate tabular-nums">
                {priceStr} • {branchAddress ? branchAddress : 'Yaba Hotels'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-3.5">
          <p className="text-xs font-semibold text-[#685F57] uppercase tracking-[0.14em]">
            {hasAnyPlatform ? `Choose Delivery Partner (${portionLabel})` : 'Dine-In & Counter Takeaway'}
          </p>

          {hasAnyPlatform ? (
            <div className="space-y-2.5">
              {hasZomato && (
                <a
                  href={platforms.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between min-h-[54px] px-4 py-3 rounded-xl bg-[#E23744] hover:bg-[#CB202D] text-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm">Order on Zomato</div>
                    <div className="text-[11px] text-white/85">
                      {portionLabel} portion delivery via Zomato
                    </div>
                  </div>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </a>
              )}

              {hasSwiggy && (
                <a
                  href={platforms.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between min-h-[54px] px-4 py-3 rounded-xl bg-[#FC8019] hover:bg-[#E86E08] text-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm">Order on Swiggy</div>
                    <div className="text-[11px] text-white/90">
                      {portionLabel} portion delivery via Swiggy
                    </div>
                  </div>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </a>
              )}

              {hasOwnly && (
                <a
                  href={platforms.ownly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between min-h-[54px] px-4 py-3 rounded-xl bg-[#DB2777] hover:bg-[#BE185D] text-white transition-colors"
                >
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <span>Order on Ownly</span>
                      <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded">Direct</span>
                    </div>
                    <div className="text-[11px] text-white/85">
                      Direct {portionLabel.toLowerCase()} portion via Ownly
                    </div>
                  </div>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-[#FCF9F4] rounded-xl border border-[#E6DDD2]">
              <p className="text-base font-serif font-semibold text-[#1E1916]">
                Available In-Store
              </p>
              <p className="text-xs text-[#685F57] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Online delivery links are not enabled for this item. Visit our counter for takeaway or dine-in service.
              </p>
              {branchAddress && (
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E6DDD2] text-xs font-medium text-[#1E1916]">
                  <svg className="w-3.5 h-3.5 text-[#E85D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{branchAddress}</span>
                </div>
              )}
            </div>
          )}

          <p className="pt-1 text-center text-[11px] text-[#685F57]">
            Opens the official {portionLabel.toLowerCase()} ordering partner in a new tab.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Editorial Restaurant Menu Card
 * Orange branding with signature Pink reserved strictly for "Order Online" actions.
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

  const partnerLabels = [
    hasZomato && 'Zomato',
    hasSwiggy && 'Swiggy',
    hasOwnly && 'Ownly',
  ].filter(Boolean);

  return (
    <article className="group bg-white rounded-xl p-4 sm:p-5 border border-[#E6DDD2] hover:border-[#D5C9BC] transition-colors flex flex-col justify-between h-full">
      <div>
        {/* Consistent 16:10 Dish Image */}
        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-[#F7F2EA] mb-4 border border-[#EFE7DC]">
          {item.image ? (
            <img
              key={item.image}
              src={resolveImageUrl(item.image)}
              alt={itemName}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              onLoad={(e) => {
                e.currentTarget.style.display = '';
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = 'none';
                }
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  e.currentTarget.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}

          <div
            className="w-full h-full flex flex-col items-center justify-center bg-[#F7F2EA] text-[#685F57]"
            style={{ display: item.image ? 'none' : 'flex' }}
          >
            <svg className="w-8 h-8 mb-1.5 text-[#B5A99D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-serif text-xs text-[#685F57]">Yaba Kitchen</span>
          </div>

          {item.category_name && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-[#1E1916]/85 text-white text-[10px] font-semibold uppercase tracking-[0.12em]">
              {item.category_name}
            </span>
          )}

          <span
            className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-[0.12em] ${
              isFull
                ? 'bg-[#E85D16] text-white'
                : 'bg-[#FCF9F4] text-[#1E1916] border border-[#E6DDD2]'
            }`}
          >
            {portionLabel}
          </span>
        </div>

        {/* Dish Header Row */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#1E1916] leading-snug group-hover:text-[#E85D16] transition-colors">
            {itemName}
          </h3>
          <span className="font-sans text-lg sm:text-xl font-bold text-[#1E1916] tabular-nums flex-shrink-0">
            {priceStr}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#685F57] leading-relaxed line-clamp-2 mb-4">
          {item.description || 'Prepared fresh to order with authentic house-blended spices and high-flame wok technique.'}
        </p>
      </div>

      {/* Card Footer CTA */}
      <div className="pt-3.5 border-t border-[#F0EAE1]">
        {canOrderOnline ? (
          <button
            type="button"
            onClick={() => onOrderOnline(item)}
            className="w-full min-h-[44px] bg-[#DB2777] hover:bg-[#BE185D] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-between gap-2 cursor-pointer"
          >
            <span>Order {portionLabel} Online</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-white/18 px-2.5 py-0.5 rounded">
              <span>{partnerLabels.join(' · ')}</span>
              <span aria-hidden="true">→</span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOrderOnline(item)}
            className="w-full min-h-[44px] bg-[#F7F2EA] hover:bg-[#EFE7DC] text-[#1E1916] font-medium text-xs sm:text-sm py-2.5 px-4 rounded-lg border border-[#E2D8CE] transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>Order Offline</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#685F57]">
              Dine-In / Takeaway
            </span>
          </button>
        )}
      </div>
    </article>
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
  const categoryScrollRef = useRef(null);

  const { data: branches = [], isLoading: loadingBranches } = useGetBranchesQuery();

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

  const {
    data: rawMenuItems = [],
    isLoading: loadingMenu,
    isError,
    error,
    refetch,
  } = useGetMenusQuery(activeBranchId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 10000,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
    refetch();

    const handleUpdate = () => {
      refetch();
    };

    window.addEventListener('yaba:data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('yaba:data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [currentBranch, refetch]);

  const handleBranchChange = (newBranchId) => {
    navigate(`/menu/${newBranchId}`);
  };

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
    <div className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pb-4">
          <ol className="flex items-center gap-2 text-xs text-[#685F57]">
            <li>
              <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#DED4C8]">/</li>
            <li aria-current="page" className="font-semibold text-[#1E1916]">
              Menu
            </li>
            {currentBranch && (
              <>
                <li aria-hidden="true" className="text-[#DED4C8]">/</li>
                <li className="text-[#685F57] truncate max-w-[180px] sm:max-w-none">
                  {currentBranch.address}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Page Editorial Header */}
        <header className="text-center max-w-2xl mx-auto pt-2 pb-7 sm:pb-9">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            Fresh From The Wok
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-tight">
            Restaurant Menu
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-[#685F57] leading-relaxed">
            Explore single and full portions across our signature Hyderabad dishes.
          </p>

          {/* Clean Branch Selector Bar */}
          {branches.length > 0 && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 py-2 bg-white rounded-xl border border-[#E6DDD2] w-full sm:w-auto">
              <label htmlFor="menu-branch-select" className="text-xs font-semibold text-[#685F57] flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#E85D16]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Outlet:</span>
              </label>
              <select
                id="menu-branch-select"
                value={activeBranchId}
                onChange={(e) => handleBranchChange(e.target.value)}
                disabled={loadingBranches}
                className="min-h-[38px] max-w-full min-w-0 w-full sm:w-auto bg-[#FCF9F4] border border-[#E2D8CE] rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#1E1916] cursor-pointer focus:outline-none focus:border-[#E85D16]"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.address}
                  </option>
                ))}
              </select>
              <Link
                to="/branches"
                className="text-xs font-semibold text-[#E85D16] hover:underline px-1.5 py-1"
              >
                All Outlets →
              </Link>
            </div>
          )}
        </header>

        {/* Sticky Category Filter Rail */}
        <div className="sticky top-16 sm:top-[72px] z-40 bg-[#FCF9F4]/98 py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-y border-[#E6DDD2] mb-8 sm:mb-10">
          <div
            ref={categoryScrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth max-w-7xl mx-auto"
          >
            <button
              type="button"
              onClick={() => setActiveCategoryId('all')}
              className={`flex-shrink-0 min-h-[38px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                activeCategoryId === 'all'
                  ? 'bg-[#E85D16] text-white'
                  : 'bg-white text-[#685F57] border border-[#E6DDD2] hover:border-[#E85D16] hover:text-[#E85D16]'
              }`}
            >
              All Dishes
            </button>

            {categories.map((cat) => {
              const isActive = String(activeCategoryId) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(String(cat.id))}
                  className={`flex-shrink-0 min-h-[38px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E85D16] text-white'
                      : 'bg-white text-[#685F57] border border-[#E6DDD2] hover:border-[#E85D16] hover:text-[#E85D16]'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl p-5 border border-[#E6DDD2] animate-pulse space-y-4"
              >
                <div className="w-full aspect-[16/10] bg-[#EFE7DC] rounded-lg" />
                <div className="h-5 bg-[#EFE7DC] rounded w-2/3" />
                <div className="h-4 bg-[#F7F2EA] rounded w-full" />
                <div className="h-11 bg-[#EFE7DC] rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="max-w-lg mx-auto bg-white rounded-xl p-8 border border-[#E6DDD2] text-center">
            <h2 className="font-serif text-xl font-semibold text-[#1E1916]">
              Unable to Load Menu
            </h2>
            <p className="text-sm text-[#685F57] mt-2 mb-6">
              {error?.data?.detail || error?.error || 'Could not retrieve dishes for this branch right now.'}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg font-semibold text-sm bg-[#E85D16] hover:bg-[#CC4D0D] text-white transition-colors cursor-pointer"
            >
              Retry Loading Menu
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingMenu && !isError && processedMenuItems.length === 0 && (
          <div className="max-w-lg mx-auto bg-white rounded-xl p-10 border border-[#E6DDD2] text-center">
            <h2 className="font-serif text-xl font-semibold text-[#1E1916]">
              No Dishes Available Right Now
            </h2>
            <p className="text-sm text-[#685F57] mt-2">
              Menu items for this outlet are being updated. Please select another branch or check back shortly.
            </p>
          </div>
        )}

        {/* View 1: All Categories */}
        {!loadingMenu && !isError && activeCategoryId === 'all' && categoriesWithItems.length > 0 && (
          <div className="space-y-12 sm:space-y-14">
            {categoriesWithItems.map((category) => (
              <section
                key={category.id}
                id={`cat-section-${category.id}`}
                className="scroll-mt-32"
              >
                <ScrollReveal className="flex items-center gap-4 mb-5 sm:mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916] tracking-tight">
                    {category.name}
                  </h2>
                  <div className="h-px bg-[#E6DDD2] flex-grow" />
                  <span className="text-xs font-medium text-[#685F57] flex-shrink-0">
                    {category.items.length} {category.items.length === 1 ? 'Dish' : 'Dishes'}
                  </span>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {category.items.map((item, idx) => (
                    <ScrollReveal key={item.id} delay={(idx % 4) * 45}>
                      <MenuItemCard
                        item={item}
                        onOrderOnline={(it) => setSelectedOrderItem(it)}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* View 2: Single Selected Category */}
        {!loadingMenu && !isError && activeCategoryId !== 'all' && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6 pb-3.5 border-b border-[#E6DDD2]">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E1916] tracking-tight">
                  {activeCategoryObj?.name || 'Category'}
                </h2>
                <p className="text-xs text-[#685F57] mt-1">
                  {activeCategoryItems.length} {activeCategoryItems.length === 1 ? 'dish' : 'dishes'} available
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategoryId('all')}
                className="text-xs sm:text-sm font-semibold text-[#E85D16] hover:underline cursor-pointer"
              >
                All Categories →
              </button>
            </div>

            {activeCategoryItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {activeCategoryItems.map((item, idx) => (
                  <ScrollReveal key={item.id} delay={(idx % 4) * 45}>
                    <MenuItemCard
                      item={item}
                      onOrderOnline={(it) => setSelectedOrderItem(it)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-[#E6DDD2] p-8 max-w-md mx-auto">
                <h3 className="font-serif text-lg font-semibold text-[#1E1916]">
                  No items in this category yet
                </h3>
                <p className="text-xs text-[#685F57] mt-1.5 mb-5">
                  Select another category or view all dishes for this branch.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCategoryId('all')}
                  className="px-5 py-2.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white text-xs font-semibold cursor-pointer"
                >
                  Back to All Dishes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Online Modal */}
      <OrderOnlineModal
        isOpen={Boolean(selectedOrderItem)}
        onClose={() => setSelectedOrderItem(null)}
        item={selectedOrderItem}
        branchAddress={currentBranch?.address}
      />
    </div>
  );
}
