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

// Duplicate items twice (14 total) for a seamless infinite mathematical loop
const TOTAL_CARDS = FOOD_ITEMS.length * 2;
const ALL_CARDS = [...FOOD_ITEMS, ...FOOD_ITEMS];

export default function FoodArcCarousel() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);

  // Animation & interaction state stored in refs to prevent React re-renders on animation frames
  const progressRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Mouse influence for desktop glide & subtle directional tilt
  const mouseInfluenceRef = useRef({ x: 0 });

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
    stageHeight: 440,
    centerX: 0,
    radiusX: 540,
    radiusY: 195,
    baselineY: 360,
    cardWidth: 232,
    cardHeight: 310,
    centerScale: 1.14,
    edgeScale: 0.84,
    visibleCount: 7,
    maxVisibleSlot: 3,
    deltaTheta: 0.28,
    tiltPerSlot: 4.0,
    dragDistance: 1200,
  });

  // React state only for re-rendering base card DOM elements when breakpoint changes
  const [stageDimensions, setStageDimensions] = useState({
    width: 0,
    stageHeight: 440,
    cardWidth: 232,
    cardHeight: 310,
  });

  // Compute responsive layout parameters for a given measured container width
  const calculateLayoutParams = useCallback((width) => {
    if (width <= 0) return null;

    let visibleCount = 7;
    let cardWidth = 232;
    let cardHeight = 310;
    let centerScale = 1.14;
    let edgeScale = 0.84;
    let stageHeight = 440;
    let deltaTheta = 0.28; // ~16 deg per slot
    let radiusX = 540;
    let radiusY = 195;
    let baselineYOffset = 170;
    let tiltPerSlot = 4.0;
    let spanRatio = 0.90; // 90% of viewport width

    if (width >= 1440) {
      // Desktop Large (1440px+)
      visibleCount = 7;
      cardWidth = 240;
      cardHeight = 320;
      centerScale = 1.14;
      edgeScale = 0.84;
      stageHeight = 450;
      deltaTheta = 0.28;
      radiusY = 200;
      baselineYOffset = 175;
      tiltPerSlot = 4.0;
      spanRatio = 0.90;
    } else if (width >= 1280) {
      // Desktop Standard (1280px - 1439px)
      visibleCount = 7;
      cardWidth = 220;
      cardHeight = 295;
      centerScale = 1.13;
      edgeScale = 0.84;
      stageHeight = 420;
      deltaTheta = 0.28;
      radiusY = 185;
      baselineYOffset = 160;
      tiltPerSlot = 3.8;
      spanRatio = 0.90;
    } else if (width >= 1024) {
      // Laptop (1024px - 1279px)
      visibleCount = 7;
      cardWidth = 192;
      cardHeight = 258;
      centerScale = 1.12;
      edgeScale = 0.84;
      stageHeight = 375;
      deltaTheta = 0.28;
      radiusY = 160;
      baselineYOffset = 140;
      tiltPerSlot = 3.8;
      spanRatio = 0.90;
    } else if (width >= 768) {
      // Tablet (768px - 1023px) - 5 visible cards
      visibleCount = 5;
      cardWidth = 160;
      cardHeight = 215;
      centerScale = 1.12;
      edgeScale = 0.85;
      stageHeight = 325;
      deltaTheta = 0.33; // ~19 deg per slot
      radiusY = 135;
      baselineYOffset = 120;
      tiltPerSlot = 3.6;
      spanRatio = 0.88;
    } else {
      // Mobile (< 768px: 360px, 375px, 390px, 430px) - 5 visible cards with guaranteed real gaps
      visibleCount = 5;
      centerScale = 1.14;
      edgeScale = 0.82;
      deltaTheta = 0.33; // ~19 deg per slot

      // Proportion card base width so cards are comfortably bigger while retaining real gaps
      cardWidth = Math.max(82, Math.min(108, Math.round(width * 0.245)));
      cardHeight = Math.round(cardWidth * 1.34);

      // Desired visible gap between card borders
      const targetGap = Math.max(8, Math.min(12, Math.round(width * 0.024)));

      // Calculate half-widths at slot 0 and slot 1 to derive radiusX directly from the target gap
      const w0 = cardWidth * centerScale;
      const midScale = centerScale - (centerScale - edgeScale) * Math.pow(0.5, 1.22);
      const w1 = cardWidth * midScale;
      const stepX = (w0 + w1) / 2 + targetGap;

      radiusX = Math.round(stepX / Math.sin(deltaTheta));
      stageHeight = Math.max(220, Math.round(cardHeight * 1.58));
      radiusY = Math.round(cardHeight * 0.54);
      baselineYOffset = Math.round(cardHeight * 0.64);
      tiltPerSlot = 3.2;
    }

    const centerX = width / 2;
    const maxVisibleSlot = visibleCount === 7 ? 3 : 2;
    const maxTheta = maxVisibleSlot * deltaTheta;
    const sinMax = Math.sin(maxTheta);

    // For desktop/tablet, compute radiusX from spanRatio; on mobile radiusX was directly derived above
    if (width >= 768) {
      radiusX = Math.max(80, (spanRatio * width - cardWidth) / (2 * sinMax));
    }

    const baselineY = baselineYOffset + radiusY;
    const dragDistance = radiusX * sinMax * 2.8;

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
    const mouseTilt = mouseInfluenceRef.current.x * 2.2;
    const maxVisible = layout.maxVisibleSlot;
    const fadeStart = maxVisible + 0.08;
    const fadeEnd = maxVisible + (layout.width < 768 ? 0.75 : 1.25);

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

      // Elliptical rainbow arc geometry:
      // x = centerX + radiusX * sin(theta)
      // y = baselineY - radiusY * cos(theta)
      const theta = slot * layout.deltaTheta;
      const arcX = layout.centerX + layout.radiusX * Math.sin(theta);
      const arcY = layout.baselineY - layout.radiusY * Math.cos(theta);

      // Smooth cosine/power scaling from center card outward
      const normSlot = Math.min(1, absSlot / maxVisible);
      const scale = layout.centerScale - (layout.centerScale - layout.edgeScale) * Math.pow(normSlot, 1.22);

      // Position card centered on the arc coordinate
      const cardW = layout.cardWidth * scale;
      const cardH = layout.cardHeight * scale;
      const x = arcX - cardW / 2;
      const y = arcY - cardH / 2;

      // Subtle rotation along the curve + gentle mouse lean
      const rotation = slot * layout.tiltPerSlot + mouseTilt;

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

        // Trigger immediate position update
        renderCards();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Initial measurement
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

  // Main GSAP animation loop and lifecycle
  useEffect(() => {
    // Check reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = motionQuery.matches;

    const handleMotionChange = (e) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        renderCards();
      }
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Idle autoplay: 1 full cycle of 14 items in ~40 seconds
    const cycleDuration = 40; // seconds
    const baseSpeed = 1 / cycleDuration;

    const onTick = (time, deltaTime) => {
      if (isPausedRef.current || prefersReducedMotionRef.current) return;

      const dt = Math.min(deltaTime / 1000, 0.1); // in seconds

      if (!isDraggingRef.current) {
        let currentSpeed = baseSpeed;

        // Desktop mouse tracking influence
        if (isHoveredRef.current && layoutRef.current.width >= 1024) {
          const mouseX = mouseInfluenceRef.current.x;
          // Glide in mouse direction: mouseX ranges from -1 to +1
          currentSpeed = baseSpeed * (1 + mouseX * 2.2);
        }

        progressRef.current = (progressRef.current + currentSpeed * dt) % 1;
      }

      renderCards();
    };

    const ctx = gsap.context(() => {
      gsap.ticker.add(onTick);
    }, stageRef);

    // Viewport IntersectionObserver to pause when scrolled out of view
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

    // Page Visibility API to pause when tab is in background
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedRef.current = true;
      } else {
        isPausedRef.current = false;
      }
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

  // Desktop Mouse Interactions
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!stageRef.current || isDraggingRef.current) return;
    if (layoutRef.current.width < 1024) return;

    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const mouseX = e.clientX;
    const relX = Math.max(-1, Math.min(1, (mouseX - centerX) / (rect.width * 0.45)));

    // Smooth quick interpolation to target cursor influence
    gsap.to(mouseInfluenceRef.current, {
      x: relX,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    // Smoothly return mouse influence to zero
    gsap.to(mouseInfluenceRef.current, {
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // Pointer & Touch Interactions (supports desktop drag and mobile swipe with pan-y)
  const handlePointerDown = useCallback((e) => {
    if (prefersReducedMotionRef.current) return;
    // Ignore non-primary mouse buttons
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

      // Determine swipe intent: allow normal vertical page scroll if user moves predominantly vertically
      if (!isDraggingRef.current && !tracker.isSwipeIntent) {
        if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
          tracker.isSwipeIntent = true;
          isDraggingRef.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // Safe fallback if pointer capture fails
          }
        } else if (Math.abs(deltaY) > 8) {
          // Normal vertical scroll taking precedence
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

        const dragDistance = layoutRef.current.dragDistance || 1000;
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

        // Apply subtle momentum on release
        const velocity = tracker.velocityX;
        if (Math.abs(velocity) > 0.18) {
          const dragDistance = layoutRef.current.dragDistance || 1000;
          const momentumProgress = (velocity * 220) / dragDistance;
          const target = progressRef.current - momentumProgress;

          gsap.to(progressRef, {
            current: target,
            duration: 0.75,
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
      className="relative w-full flex justify-center items-start select-none"
      style={{
        minHeight: `${stageDimensions.stageHeight}px`,
        touchAction: 'pan-y', // Keep native vertical page scrolling intact on touch devices
      }}
      role="region"
      aria-label="Featured food dishes carousel"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Centred stage with ample height so cards are NEVER clipped at bottom */}
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
              {/* Card container with portrait ratio, tailored corners, and authentic shadows */}
              <div className="relative w-full h-full rounded-[14px] sm:rounded-[18px] overflow-hidden bg-[#29211C] shadow-[0_8px_20px_rgba(41,33,28,0.18)] sm:shadow-[0_14px_30px_rgba(41,33,28,0.18)] border border-white/15 transition-shadow duration-300">
                {/* Food Image photography */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                  loading="eager"
                />

                {/* Dark espresso transparent bottom gradient overlay for readability */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#1F1713]/90 via-[#1F1713]/30 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Dish name in readable white typography */}
                <div className="absolute bottom-0 inset-x-0 p-1.5 sm:p-3.5 text-center pointer-events-none">
                  <p className="font-sans text-white font-medium text-[10.5px] sm:text-[13.5px] md:text-[14px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] truncate tracking-wide">
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
