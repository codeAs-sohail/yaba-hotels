import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

// 7 distinct food items with correct public asset paths
const FOOD_ITEMS = [
  {
    name: 'Noodles',
    image: '/carousel-images/noodles.jpg',
    alt: 'Wok tossed noodles with crisp vegetables',
  },
  {
    name: 'Fried Rice',
    image: '/carousel-images/fried-rice.jpg',
    alt: 'Authentic wok-fired golden fried rice',
  },
  {
    name: 'Double Egg Fried Rice',
    image: '/carousel-images/double-egg-fried-rice.jpg',
    alt: 'Double egg fried rice prepared hot on the flame',
  },
  {
    name: 'Chicken Tandoori',
    image: '/carousel-images/chicken-tandoori.jpg',
    alt: 'Smoky, charred chicken tandoori',
  },
  {
    name: 'Chicken 65 Gravy',
    image: '/carousel-images/chicken-65-gravy.jpg',
    alt: 'Hyderabadi chicken 65 with rich spiced gravy',
  },
  {
    name: 'Chicken Leg Piece',
    image: '/carousel-images/chicken-leg-piece.jpg',
    alt: 'Juicy spiced charred chicken leg piece',
  },
  {
    name: 'Talawa Gosht Zeera Rice',
    image: '/carousel-images/talawa-gosht-zeera-rice.jpg',
    alt: 'Tender talawa gosht paired with fragrant zeera rice',
  },
];

// Duplicate items twice (14 total) for a seamless infinite loop
const TOTAL_CARDS = FOOD_ITEMS.length * 2;
const ALL_CARDS = [...FOOD_ITEMS, ...FOOD_ITEMS];

export default function FoodArcCarousel() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  // Animation & interaction state stored in refs to prevent unnecessary React re-renders
  const progressRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Touch / pointer tracking for smooth mobile swipe & momentum
  const dragTrackerRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    startProgress: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    isSwipeIntent: false,
  });

  // Cached geometry and responsive parameters
  const layoutRef = useRef({
    width: 0,
    stageHeight: 380,
    centerX: 0,
    radiusX: 420,
    radiusY: 85,
    baselineY: 260,
    cardWidth: 195,
    cardHeight: 260,
    centerScale: 1.08,
    edgeScale: 0.88,
    visibleCount: 7,
    maxVisibleSlot: 3,
    deltaTheta: 0.24,
    tiltPerSlot: 1.8,
    dragDistance: 900,
  });

  // React state for re-rendering base card DOM elements when breakpoint changes
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    stageHeight: 380,
    cardWidth: 195,
    cardHeight: 260,
  });

  // Compute clean, balanced responsive layout parameters
  const calculateLayoutParams = useCallback((width) => {
    if (width <= 0) return null;

    let visibleCount = 7;
    let cardWidth = 195;
    let cardHeight = 260;
    let centerScale = 1.08;
    let edgeScale = 0.88;
    let stageHeight = 360;
    let deltaTheta = 0.23; // clean ~13 deg per slot
    let radiusX = 430;
    let radiusY = 75; // subtle, clean arc without extreme bowing
    let baselineYOffset = 135;
    let tiltPerSlot = 1.6; // gentle tilt that looks neat on desktop

    if (width >= 1440) {
      // Desktop Large (1440px+)
      visibleCount = 7;
      cardWidth = 205;
      cardHeight = 275;
      centerScale = 1.08;
      edgeScale = 0.88;
      stageHeight = 370;
      deltaTheta = 0.22;
      radiusX = Math.min(540, width * 0.36);
      radiusY = 70;
      baselineYOffset = 140;
      tiltPerSlot = 1.5;
    } else if (width >= 1280) {
      // Desktop Standard (1280px - 1439px)
      visibleCount = 7;
      cardWidth = 190;
      cardHeight = 255;
      centerScale = 1.08;
      edgeScale = 0.88;
      stageHeight = 350;
      deltaTheta = 0.23;
      radiusX = Math.min(480, width * 0.36);
      radiusY = 65;
      baselineYOffset = 135;
      tiltPerSlot = 1.6;
    } else if (width >= 1024) {
      // Laptop (1024px - 1279px)
      visibleCount = 7;
      cardWidth = 175;
      cardHeight = 235;
      centerScale = 1.07;
      edgeScale = 0.88;
      stageHeight = 330;
      deltaTheta = 0.24;
      radiusX = Math.min(420, width * 0.38);
      radiusY = 60;
      baselineYOffset = 125;
      tiltPerSlot = 1.8;
    } else if (width >= 768) {
      // Tablet (768px - 1023px) - 5 visible cards
      visibleCount = 5;
      cardWidth = 150;
      cardHeight = 200;
      centerScale = 1.08;
      edgeScale = 0.86;
      stageHeight = 290;
      deltaTheta = 0.30;
      radiusX = Math.min(320, width * 0.38);
      radiusY = 55;
      baselineYOffset = 110;
      tiltPerSlot = 2.2;
    } else {
      // Mobile (< 768px) - 5 visible cards
      visibleCount = 5;
      centerScale = 1.12;
      edgeScale = 0.82;
      deltaTheta = 0.33;

      cardWidth = Math.max(82, Math.min(108, Math.round(width * 0.245)));
      cardHeight = Math.round(cardWidth * 1.34);

      const targetGap = Math.max(8, Math.min(12, Math.round(width * 0.024)));
      const w0 = cardWidth * centerScale;
      const midScale = centerScale - (centerScale - edgeScale) * Math.pow(0.5, 1.22);
      const w1 = cardWidth * midScale;
      const stepX = (w0 + w1) / 2 + targetGap;

      radiusX = Math.round(stepX / Math.sin(deltaTheta));
      stageHeight = Math.max(220, Math.round(cardHeight * 1.55));
      radiusY = Math.round(cardHeight * 0.45);
      baselineYOffset = Math.round(cardHeight * 0.60);
      tiltPerSlot = 2.8;
    }

    const centerX = width / 2;
    const maxVisibleSlot = visibleCount === 7 ? 3 : 2;
    const baselineY = baselineYOffset + radiusY;
    const dragDistance = radiusX * Math.sin(maxVisibleSlot * deltaTheta) * 2.5;

    return {
      width,
      stageHeight,
      centerX,
      radiusX,
      radiusY,
      baselineY,
      cardWidth,
      cardHeight,
      centerScale,
      edgeScale,
      visibleCount,
      maxVisibleSlot,
      deltaTheta,
      tiltPerSlot,
      dragDistance,
    };
  }, []);

  // Update card transforms using direct GSAP transforms without React re-renders
  const renderCards = useCallback(() => {
    const layout = layoutRef.current;
    if (!layout.width) return;

    const progress = progressRef.current;
    const maxVisible = layout.maxVisibleSlot;
    const fadeStart = maxVisible - 0.15;
    const fadeEnd = maxVisible + (layout.width < 768 ? 0.7 : 0.85);

    for (let i = 0; i < TOTAL_CARDS; i++) {
      const cardEl = cardsRef.current[i];
      if (!cardEl) continue;

      // Continuous slot position in range [-7, 7)
      let slot = ((i - progress * TOTAL_CARDS) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS;
      if (slot > 7) slot -= 14;

      const absSlot = Math.abs(slot);

      // Handle card visibility & smooth fade at arc edges
      if (absSlot > fadeEnd) {
        gsap.set(cardEl, { opacity: 0, visibility: 'hidden' });
        continue;
      }

      let opacity = 1;
      if (absSlot > fadeStart) {
        opacity = Math.max(0, 1 - (absSlot - fadeStart) / (fadeEnd - fadeStart));
      }

      // Smooth horizontal arc geometry
      const theta = slot * layout.deltaTheta;
      const arcX = layout.centerX + layout.radiusX * Math.sin(theta);
      const arcY = layout.baselineY - layout.radiusY * Math.cos(theta);

      // Gentle scaling
      const normSlot = Math.min(1, absSlot / maxVisible);
      const scale = layout.centerScale - (layout.centerScale - layout.edgeScale) * Math.pow(normSlot, 1.2);

      // Position card centered on the arc coordinate
      const cardW = layout.cardWidth * scale;
      const cardH = layout.cardHeight * scale;
      const x = arcX - cardW / 2;
      const y = arcY - cardH / 2;

      // Subtle, clean rotation along the curve
      const rotation = slot * layout.tiltPerSlot;

      // Center card has highest z-index, symmetrically layering outward
      const zIndex = Math.round(30 - Math.min(absSlot, 6) * 4);

      gsap.set(cardEl, {
        x,
        y,
        scale,
        rotation,
        zIndex,
        opacity,
        visibility: 'visible',
        overwrite: 'auto',
      });
    }
  }, []);

  // Set up container measurement via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = (entries) => {
      for (const entry of entries) {
        const measuredWidth = Math.round(entry.contentRect.width || entry.target.clientWidth);
        if (measuredWidth <= 0) continue;

        const layout = calculateLayoutParams(measuredWidth);
        if (!layout) continue;

        layoutRef.current = layout;
        setStageDimensions({
          width: layout.width,
          stageHeight: layout.stageHeight,
          cardWidth: layout.cardWidth,
          cardHeight: layout.cardHeight,
        });

        renderCards();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const initialWidth = container.clientWidth || window.innerWidth;
    const initialLayout = calculateLayoutParams(initialWidth);
    if (initialLayout) {
      layoutRef.current = initialLayout;
      setStageDimensions({
        width: initialLayout.width,
        stageHeight: initialLayout.stageHeight,
        cardWidth: initialLayout.cardWidth,
        cardHeight: initialLayout.cardHeight,
      });
    }

    return () => resizeObserver.disconnect();
  }, [calculateLayoutParams, renderCards]);

  // Main animation ticker
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        renderCards();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Smooth steady autoplay: 1 full cycle in 45 seconds
    const cycleDuration = 45;
    const baseSpeed = 1 / cycleDuration;

    const onTick = (time, deltaTime) => {
      if (isPausedRef.current || prefersReducedMotionRef.current) return;

      const dt = Math.min(deltaTime / 1000, 0.1);

      if (!isDraggingRef.current && !isHoveredRef.current) {
        progressRef.current = (progressRef.current + baseSpeed * dt) % 1;
      }

      renderCards();
    };

    const ctx = gsap.context(() => {
      gsap.ticker.add(onTick);
    }, stageRef);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isPausedRef.current = !entry.isIntersecting;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      ctx.revert();
      gsap.ticker.remove(onTick);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [renderCards]);

  // Desktop Hover (gently pauses autoplay so users can admire the dish)
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  // Pointer & Touch Drag Interactions
  const handlePointerDown = useCallback((e) => {
    if (prefersReducedMotionRef.current) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const tracker = dragTrackerRef.current;
    tracker.pointerId = e.pointerId;
    tracker.startX = e.clientX;
    tracker.startY = e.clientY;
    tracker.lastX = e.clientX;
    tracker.lastTime = performance.now();
    tracker.startProgress = progressRef.current;
    tracker.velocityX = 0;
    tracker.isSwipeIntent = false;
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const tracker = dragTrackerRef.current;
      if (tracker.pointerId !== e.pointerId) return;

      const deltaX = e.clientX - tracker.startX;
      const deltaY = e.clientY - tracker.startY;

      if (!isDraggingRef.current && !tracker.isSwipeIntent) {
        if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
          tracker.isSwipeIntent = true;
          isDraggingRef.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Safe fallback
          }
        } else if (Math.abs(deltaY) > 8) {
          tracker.pointerId = null;
          return;
        }
      }

      if (isDraggingRef.current) {
        const now = performance.now();
        const dt = now - tracker.lastTime;
        if (dt > 0) {
          tracker.velocityX = (e.clientX - tracker.lastX) / dt;
        }
        tracker.lastX = e.clientX;
        tracker.lastTime = now;

        const dragDistance = layoutRef.current.dragDistance || 900;
        const progressDelta = deltaX / dragDistance;

        progressRef.current = (tracker.startProgress - progressDelta + 10) % 1;
        renderCards();
      }
    },
    [renderCards]
  );

  const handlePointerUp = useCallback(
    (e) => {
      const tracker = dragTrackerRef.current;
      if (tracker.pointerId !== e.pointerId) return;

      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore
        }

        const velocity = tracker.velocityX;
        if (Math.abs(velocity) > 0.18) {
          const dragDistance = layoutRef.current.dragDistance || 900;
          const momentumProgress = (velocity * 200) / dragDistance;
          const target = progressRef.current - momentumProgress;

          gsap.to(progressRef, {
            current: target,
            duration: 0.7,
            ease: 'power2.out',
            onUpdate: renderCards,
          });
        }
      }

      tracker.pointerId = null;
      tracker.isSwipeIntent = false;
    },
    [renderCards]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto flex justify-center items-center select-none overflow-hidden py-2"
      style={{
        minHeight: `${stageDimensions.stageHeight}px`,
        touchAction: 'pan-y',
      }}
      role="region"
      aria-label="Featured food dishes carousel"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={stageRef}
        className="relative w-full cursor-grab active:cursor-grabbing"
        style={{
          height: `${stageDimensions.stageHeight}px`,
          transformOrigin: '50% 50%',
        }}
      >
        {ALL_CARDS.map((item, index) => {
          return (
            <div
              key={`card-${index}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="absolute top-0 left-0"
              style={{
                width: `${stageDimensions.cardWidth}px`,
                height: `${stageDimensions.cardHeight}px`,
                transformOrigin: '50% 50%',
                willChange: 'transform, opacity',
              }}
              role="listitem"
              aria-label={item.name}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#29211C] shadow-[0_10px_25px_rgba(41,33,28,0.14)] border border-white/20 transition-shadow duration-300">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                  loading="eager"
                />

                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#1F1713]/90 via-[#1F1713]/25 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <div className="absolute bottom-0 inset-x-0 p-2 sm:p-3 text-center pointer-events-none">
                  <p className="font-sans text-white font-medium text-[11px] sm:text-[13px] md:text-[13.5px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] truncate tracking-wide">
                    {item.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
