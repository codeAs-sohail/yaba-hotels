import React from 'react';
import { resolveImageUrl } from '../../../api/config';

/**
 * Mobile-first Menu Item Card.
 * Displays image, portion badge, item name, price, category, branch address,
 * delivery platform status badges (Zomato, Swiggy, Ownly), and action buttons.
 */
export default function MenuCard({ item, onEdit, onDelete }) {
  const platforms = item.online_platforms || {};
  const hasZomato = Boolean(platforms.zomato);
  const hasSwiggy = Boolean(platforms.swiggy);
  const hasOwnly = Boolean(platforms.ownly);

  return (
    <div className="bg-white rounded-2xl border border-[#141414]/10 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Card Image with Portion Badge */}
        <div className="relative aspect-[16/10] bg-[#141414]/5 overflow-hidden">
          {item.image ? (
            <img
              key={item.image}
              src={resolveImageUrl(item.image)}
              alt={item.item}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
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
            className="w-full h-full flex flex-col items-center justify-center text-[#555555]/50 bg-[#FFFBEA]"
            style={{ display: item.image ? 'none' : 'flex' }}
          >
            <span className="text-3xl mb-1">🍲</span>
            <span className="text-xs">No image uploaded</span>
          </div>

          {/* Portion Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                item.item_type === 'full'
                  ? 'bg-[#141414] text-[#F2E205]'
                  : 'bg-[#F2E205] text-[#141414]'
              }`}
            >
              {item.item_type === 'full' ? 'Full Portion' : 'Single Portion'}
            </span>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl shadow-md border border-[#141414]/10">
            <span className="font-serif font-bold text-base text-[#141414]">
              ₹{Number(item.price).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Content details */}
        <div className="p-4 sm:p-5">
          {/* Category Pill */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#B94720] bg-[#B94720]/10 px-2.5 py-0.5 rounded-md">
              {item.category_name || 'Category'}
            </span>
          </div>

          {/* Item Name */}
          <h3 className="font-sans font-bold text-lg text-[#141414] leading-snug line-clamp-1">
            {item.item}
          </h3>

          {/* Description if present */}
          {item.description && (
            <p className="mt-1 text-xs text-[#555555] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Branch Address */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#555555]">
            <svg
              className="w-3.5 h-3.5 text-[#E85D16] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate font-medium">{item.branch_address || 'Branch'}</span>
          </div>

          {/* Delivery Platforms Status */}
          <div className="mt-4 pt-3 border-t border-[#141414]/8">
            <div className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider mb-2">
              Delivery Platforms
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {!hasZomato && !hasSwiggy && !hasOwnly ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#FFFBEA] text-[#141414] border border-[#F2E205]">
                  <span>📞</span>
                  <span>Order Offline (All links disabled)</span>
                </span>
              ) : (
                <>
                  {/* Zomato */}
                  {hasZomato ? (
                    <a
                      href={platforms.zomato}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                      Zomato
                    </a>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100">
                      Zomato —
                    </span>
                  )}

                  {/* Swiggy */}
                  {hasSwiggy ? (
                    <a
                      href={platforms.swiggy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                      Swiggy
                    </a>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100">
                      Swiggy —
                    </span>
                  )}

                  {/* Ownly */}
                  {hasOwnly ? (
                    <a
                      href={platforms.ownly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-50 text-amber-800 border border-yellow-200 hover:bg-yellow-100 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                      Ownly
                    </a>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100">
                      Ownly —
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 sm:p-5 pt-0 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onEdit(item)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-[#141414] bg-[#FFFBEA] hover:bg-[#F2E205] border border-[#141414]/12 transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span>Update</span>
        </button>

        <button
          onClick={() => onDelete(item)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
