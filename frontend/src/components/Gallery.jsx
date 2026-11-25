import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetGalleryQuery } from '../features/dashboard/dashboardApi';
import { resolveImageUrl } from '../api/config';

/**
 * Public Customer Gallery Page.
 * Displays photo showcase of restaurant ambiance, sizzling kitchens, and dining spaces.
 * Features responsive masonry grid, full-screen lightbox modal with keyboard navigation,
 * and loading skeletons.
 */
export default function Gallery() {
  const {
    data: rawGallery = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetGalleryQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 10000,
  });
  const gallery = rawGallery.filter((img) => img.is_visible !== false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    document.title = 'Gallery | Yaba Fast Food — Authentic Dining Showcase';
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
  }, [refetch]);

  // Keyboard navigation for Lightbox (Escape to close, ArrowLeft / ArrowRight to cycle)
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex, gallery.length]);

  const activePhoto = selectedImageIndex !== null ? gallery[selectedImageIndex] : null;

  return (
    <article className="min-h-screen bg-[#FFFBEA] text-[#141414] font-sans selection:bg-[#F2E205] selection:text-[#141414] pt-24 sm:pt-28 pb-20">
      {/* Background Texture */}
      <div
        className="w-full"
        style={{
          backgroundImage:
            'radial-gradient(rgba(20, 20, 20, 0.035) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-xs sm:text-sm text-[#766D65]">
              <li>
                <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-[#766D65]/60">/</span>
              </li>
              <li className="font-semibold text-[#141414]">Gallery</li>
            </ol>
          </nav>

          {/* Page Header */}
          <header className="max-w-3xl mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2E205]/40 text-[#141414] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F2E205]">
              <span>📸 Restaurant Showcase</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#141414] tracking-tight leading-tight">
              A Glimpse Into Authentic Flavors & Moments
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#555555] leading-relaxed">
              Explore the heart of Yaba Fast Food: from roaring wok fires and sizzling delicacies
              to our comfortable family dining tables across Hyderabad.
            </p>
          </header>

          {/* Loading Skeletons - only on initial load, not during background refetch */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div
                  key={n}
                  className="aspect-square rounded-2xl bg-gray-200/80 animate-pulse border border-[#141414]/5 shadow-xs"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && gallery.length === 0 && (
            <div className="bg-white/80 backdrop-blur-xs rounded-3xl p-10 sm:p-16 border border-[#141414]/10 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#FFFBEA] border border-[#F2E205] text-3xl flex items-center justify-center mx-auto mb-4">
                📷
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#141414]">
                Fresh Moments Coming Soon
              </h2>
              <p className="text-sm text-[#555555] mt-2 mb-8 leading-relaxed">
                We are curating high-definition moments from our kitchen and dining halls.
                In the meantime, take a look at our delicious menu or find a branch near you!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F2E205] hover:bg-[#E5D500] text-[#141414] font-bold text-sm shadow-sm transition-all"
                >
                  Explore Menu
                </Link>
                <Link
                  to="/branches"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-[#141414]/20 hover:bg-gray-50 text-[#141414] font-bold text-sm transition-all"
                >
                  Find a Branch
                </Link>
              </div>
            </div>
          )}

          {/* Gallery Photo Grid — show whenever we have data, even during background refetch */}
          {!isLoading && gallery.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#766D65]">
                  Showing {gallery.length} authentic {gallery.length === 1 ? 'photo' : 'photos'}
                </span>
                <span className="text-xs text-[#766D65]">Click any image to expand</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {gallery.map((img, idx) => {
                  const resolvedUrl = resolveImageUrl(img.image_link);

                  return (
                    <div
                      key={img.id || idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedImageIndex(idx);
                        }
                      }}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-[#141414]/5 border border-[#141414]/10 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E85D16]"
                    >
                      <img
                        src={resolvedUrl}
                        alt={`Restaurant Photo ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        onError={(e) => {
                          // Show a friendly placeholder instead of a blank box
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.img-error-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'img-error-placeholder absolute inset-0 flex flex-col items-center justify-center text-[#766D65]/60 gap-2';
                            placeholder.innerHTML = '<span class="text-3xl">🍽️</span><span class="text-xs font-medium">Photo loading...</span>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />

                      {/* Hover Overlay with Magnifying Glass Icon */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#141414] flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors z-20 cursor-pointer"
            aria-label="Close photo preview"
          >
            ✕
          </button>

          {/* Photo Counter */}
          <div className="absolute top-5 left-5 text-white/80 text-xs sm:text-sm font-semibold tracking-wider z-20">
            {selectedImageIndex + 1} / {gallery.length}
          </div>

          {/* Navigation - Previous */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-2xl transition-colors z-20 cursor-pointer"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {/* Navigation - Next */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center text-2xl transition-colors z-20 cursor-pointer"
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          {/* Centered Image Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveImageUrl(activePhoto.image_link)}
              alt={`Photo ${selectedImageIndex + 1}`}
              className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </article>
  );
}
