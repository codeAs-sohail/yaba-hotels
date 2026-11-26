import React, { useEffect, useRef, useState } from 'react';

/**
 * Lightweight, mobile-first scroll reveal wrapper using IntersectionObserver.
 * - Uses only GPU-composited transform & opacity (zero layout shifts).
 * - Immediately reveals and stops observing once in view.
 * - Respects `prefers-reduced-motion` and provides a safety fallback so content
 *   is never trapped hidden on low-end devices.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as: Component = 'div',
  threshold = 0.05,
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  });

  useEffect(() => {
    if (revealed) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    // Immediate reveal if already near or inside viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.98) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(el);
            break;
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -24px 0px',
      }
    );

    observer.observe(el);

    // Safety fallback timer so slow/stalled observers never keep content hidden
    const fallbackTimer = setTimeout(() => {
      setRevealed(true);
    }, 1600);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [revealed, threshold]);

  return (
    <Component
      ref={ref}
      className={`reveal-on-scroll ${revealed ? 'is-revealed' : ''} ${className}`}
      style={delay > 0 ? { transitionDelay: `${Math.min(delay, 280)}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
