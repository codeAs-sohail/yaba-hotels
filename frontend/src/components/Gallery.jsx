import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetGalleryQuery } from '../features/dashboard/dashboardApi';
import { resolveImageUrl } from '../api/config';
import ScrollReveal from './ScrollReveal';

/**
 * Public Customer Gallery Page.
 * Editorial photo showcase with staggered ScrollReveal, clean 1px framing,
 * responsive lightbox with keyboard & touch navigation.
 */
export default function Gallery() {
  const {
    data: rawGallery = [],
    isLoading,
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
    <article className="min-h-screen bg-[#FCF9F4] text-[#1E1916] font-sans selection:bg-[#E85D16]/15 selection:text-[#E85D16] pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="pb-4">
          <ol className="flex items-center space-x-2 text-xs text-[#685F57]">
            <li>
              <Link to="/home" className="hover:text-[#E85D16] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#DED4C8]">/</li>
            <li aria-current="page" className="font-semibold text-[#1E1916]">
              Gallery
            </li>
          </ol>
        </nav>

        {/* Editorial Page Header */}
        <header className="max-w-2xl mb-10 sm:mb-12 pt-2">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#E85D16] mb-2">
            Restaurant Showcase
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E1916] tracking-tight leading-[1.15]">
            A Glimpse Into Authentic Flavors &amp; Moments
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#685F57] leading-relaxed">
            From high-flame woks and signature delicacies to comfortable family dining spaces across our five Hyderabad outlets.
          </p>
        </header>

        {/* Loading Skeletons - initial load only */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="aspect-square rounded-xl bg-[#EFE7DC] animate-pulse border border-[#E6DDD2]"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && gallery.length === 0 && (
          <div className="bg-white rounded-xl p-10 sm:p-14 border border-[#E6DDD2] text-center max-w-lg mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-[#1E1916]">
              Gallery Curating Soon
            </h2>
            <p className="text-sm text-[#685F57] mt-2 mb-7 leading-relaxed">
              We are adding new photography from our kitchens and dining rooms. Explore our menu or locate your nearest outlet below.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/menu"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#E85D16] hover:bg-[#CC4D0D] text-white font-semibold text-sm transition-colors"
              >
                Explore Menu
              </Link>
              <Link
                to="/branches"
                className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-white border border-[#E2D8CE] hover:border-[#E85D16] text-[#1E1916] font-semibold text-sm transition-colors"
              >
                Find a Branch
              </Link>
            </div>
          </div>
        )}

        {/* Gallery Grid — stays visible during background polling refetches */}
        {!isLoading && gallery.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E6DDD2]">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#685F57]">
                {gallery.length} {gallery.length === 1 ? 'Photograph' : 'Photographs'}
              </span>
              <span className="text-xs text-[#685F57]">Tap any photo to expand</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {gallery.map((img, idx) => {
                const resolvedUrl = resolveImageUrl(img.image_link);

                return (
                  <ScrollReveal key={img.id || idx} delay={(idx % 4) * 50}>
                    <div
                      onClick={() => setSelectedImageIndex(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedImageIndex(idx);
                        }
                      }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-[#F7F2EA] border border-[#E6DDD2] hover:border-[#E85D16]/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E85D16]"
                    >
                      <img
                        key={resolvedUrl}
                        src={resolvedUrl}
                        alt={`Yaba Hotels dining and dish photograph ${idx + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onLoad={(e) => {
                          e.currentTarget.style.display = '';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.img-error-placeholder');
                          if (placeholder) placeholder.remove();
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.img-error-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'img-error-placeholder absolute inset-0 flex flex-col items-center justify-center text-[#685F57] gap-1.5 text-xs';
                            placeholder.innerHTML = '<span>Photo unavailable</span>';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />

                      {/* Subtle Hover Indicator */}
                      <div className="absolute inset-0 bg-[#1E1916]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white text-[#1E1916] flex items-center justify-center shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-[#181310]/94 flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-lg bg-white/12 hover:bg-[#E85D16] text-white flex items-center justify-center transition-colors z-20 cursor-pointer"
            aria-label="Close photo preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-5 left-5 text-white/85 text-xs sm:text-sm font-medium tracking-wider z-20 tabular-nums">
            {selectedImageIndex + 1} / {gallery.length}
          </div>

          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-white/12 hover:bg-[#E85D16] text-white flex items-center justify-center text-2xl transition-colors z-20 cursor-pointer"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-lg bg-white/12 hover:bg-[#E85D16] text-white flex items-center justify-center text-2xl transition-colors z-20 cursor-pointer"
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={activePhoto.image_link}
              src={resolveImageUrl(activePhoto.image_link)}
              alt={`Photo ${selectedImageIndex + 1}`}
              className="max-h-[82vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </article>
  );
}
