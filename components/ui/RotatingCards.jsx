"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BorderGlow from "./BorderGlow";

// Rating threshold for showing the "HOT" flame badge on a card.
const HOT_RATING_THRESHOLD = 7.5;

// Mobile = full-bleed poster, no title bar. Matches Tailwind's `sm` cutoff
// so it lines up with the rest of the app's responsive behaviour.
const MOBILE_BREAKPOINT = 640;

function FireIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-orange-400 drop-shadow-[0_0_3px_rgba(251,146,60,0.85)]"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z"
      />
    </svg>
  );
}

export default function RotatingCards({
  movies = [],
  radius: radiusProp = 340,
  cardWidth: cardWidthProp = 170,
  cardHeight: cardHeightProp = 280,
  duration = 26,
  autoPlay = true,
}) {
  const router = useRouter();
  const stageRef = useRef(null);
  const ringRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);
  const runningRef = useRef(autoPlay);
  const hoveredRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const downPos = useRef({ x: 0, y: 0, time: 0 });

  // Screen size ke hisaab se dimensions scale karo
  const [dims, setDims] = useState({
    radius: radiusProp,
    cardWidth: cardWidthProp,
    cardHeight: cardHeightProp,
    scale: 1,
    isMobile: false,
  });

  useEffect(() => {
    const computeDims = () => {
      const w = window.innerWidth;
      let scale = 1;
      if (w < 400) scale = 0.42;
      else if (w < 640) scale = 0.55;
      else if (w < 768) scale = 0.7;
      else if (w < 1024) scale = 0.85;

      setDims({
        radius: Math.round(radiusProp * scale),
        cardWidth: Math.round(cardWidthProp * scale),
        cardHeight: Math.round(cardHeightProp * scale),
        scale,
        isMobile: w < MOBILE_BREAKPOINT,
      });
    };

    computeDims();
    window.addEventListener("resize", computeDims);
    return () => window.removeEventListener("resize", computeDims);
  }, [radiusProp, cardWidthProp, cardHeightProp]);

  const { radius, cardWidth, cardHeight, scale, isMobile } = dims;

  // Badge sizing: scales with the card, with a smaller floor + smaller
  // base size on mobile so the flame/rating stay dainty on a full-bleed
  // poster instead of dominating it.
  const fireBadgeSize = Math.max(isMobile ? 13 : 16, Math.round((isMobile ? 16 : 24) * scale));
  const fireIconSize = Math.round(fireBadgeSize * 0.55);
  const ratingFontSize = Math.max(isMobile ? 7 : 8, Math.round((isMobile ? 9 : 11) * scale));
  const ratingIconSize = Math.max(isMobile ? 7 : 8, Math.round((isMobile ? 10 : 12) * scale));
  const badgePadX = Math.max(isMobile ? 3 : 4, Math.round((isMobile ? 6 : 8) * scale));
  const badgePadY = Math.max(1, Math.round((isMobile ? 1 : 2) * scale));
  const badgeOffset = Math.max(4, Math.round(8 * scale));
  const titleFontSize = Math.max(9, Math.round(12 * scale));

  const count = movies.length;
  const step = count > 0 ? 360 / count : 0;
  const degPerMs = 360 / (duration * 1000);

  // Desktop reserves space for the title bar under the poster. Mobile is
  // full-bleed poster — the whole card is the image, no bar, no title.
  const infoHeight = isMobile ? 0 : Math.max(Math.round(cardHeight * 0.2), 34);
  const posterHeight = cardHeight - infoHeight;

  const applyAngle = useCallback((deg) => {
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${deg}deg)`;
    }
  }, []);

  useEffect(() => {
    let lastTime = null;
    const tick = (t) => {
      if (lastTime === null) lastTime = t;
      const dt = t - lastTime;
      lastTime = t;

      if (runningRef.current && !draggingRef.current && !hoveredRef.current) {
        angleRef.current = (angleRef.current + dt * degPerMs) % 360;
        applyAngle(angleRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [degPerMs, applyAngle]);

  useEffect(() => {
    if (!stageRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        runningRef.current = autoPlay && entry.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, [autoPlay]);

  const handlePointerDown = useCallback((e) => {
    draggingRef.current = true;
    dragStartX.current = e.clientX;
    dragStartAngle.current = angleRef.current;
    downPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    ringRef.current?.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartX.current;
    angleRef.current = dragStartAngle.current + dx * 0.3;
    applyAngle(angleRef.current);
  }, [applyAngle]);

  const handlePointerUp = useCallback((e) => {
    draggingRef.current = false;
    ringRef.current?.releasePointerCapture?.(e.pointerId);

    const dx = Math.abs(e.clientX - downPos.current.x);
    const dy = Math.abs(e.clientY - downPos.current.y);
    const dt = Date.now() - downPos.current.time;

    // Chhota movement + jaldi release = ye click tha, drag nahi
    if (dx < 6 && dy < 6 && dt < 500) {
      // Pointer capture ki wajah se card ka apna onPointerUp nahi chalta,
      // isliye yahan manually pata lagate hain us waqt cursor ke neeche kaunsa card tha
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cardEl = el?.closest("[data-movie-id]");
      if (cardEl) {
        const id = cardEl.getAttribute("data-movie-id");
        router.push(`/movie/${id}`);
      }
    }
  }, [router]);

  if (count === 0) return null;

  return (
    <div
      ref={stageRef}
      className="relative w-full flex items-center justify-center select-none overflow-hidden"
      style={{ height: cardHeight + 160, perspective: cardWidth < 100 ? 900 : 1400 }}
    >
      <div
        ref={ringRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative cursor-grab active:cursor-grabbing"
        style={{
          width: cardWidth,
          height: cardHeight,
          transformStyle: "preserve-3d",
          transform: "rotateY(0deg)",
          touchAction: "pan-y",
        }}
      >
        {movies.map((m, i) => {
          const isHot = typeof m.vote_average === "number" && m.vote_average >= HOT_RATING_THRESHOLD;

          return (
            <div
              key={m.id}
              data-movie-id={m.id}
              onPointerEnter={() => { hoveredRef.current = true; }}
              onPointerLeave={() => { hoveredRef.current = false; }}
              className="absolute top-0 left-0 block cursor-pointer"
              style={{
                width: cardWidth,
                height: cardHeight,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <BorderGlow
                alwaysOn
                borderRadius={12}
                borderWidth={2.5}
                glowRadius={20}
                glowIntensity={1.5}
                spinDuration={4}
                colors={["#FFD166", "#F97316", "#F43F5E", "#A855F7"]}
                backgroundColor="#16121e"
                fillOpacity={0}
                className="w-full h-full"
              >
                {/* relative wrapper = the whole card. Badges below are
                    pinned to ITS corners, so they land in the same spot
                    whether the card is full-bleed poster (mobile) or
                    poster + title bar (desktop). */}
                <div className="relative flex flex-col h-full">
                  <div
                    className="relative w-full overflow-hidden bg-surface2"
                    style={{
                      height: posterHeight,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      borderBottomLeftRadius: isMobile ? 12 : 0,
                      borderBottomRightRadius: isMobile ? 12 : 0,
                    }}
                  >
                    {m.poster_path ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}${m.poster_path}`}
                        alt={m.title}
                        fill
                        sizes={`${cardWidth}px`}
                        quality={75}
                        loading="eager"
                        priority
                        className="object-cover pointer-events-none"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-muted bg-surface2 p-2 text-center"
                        style={{ fontSize: titleFontSize }}
                      >
                        {m.title}
                      </div>
                    )}
                  </div>

                  {!isMobile && (
                    <div
                      className="flex items-center px-2.5 bg-[#16121e] rounded-b-[12px]"
                      style={{ height: infoHeight }}
                    >
                      <h3
                        className="font-body font-bold text-paper line-clamp-2 leading-snug"
                        style={{ fontSize: titleFontSize }}
                      >
                        {m.title}
                      </h3>
                    </div>
                  )}

                  {/* Single flex row for both badges — items-center keeps
                      the flame and rating vertically centred against each
                      other (aamne-saamne) no matter how their individual
                      heights differ at small mobile sizes. When a movie
                      isn't hot we still render the flame slot but make it
                      invisible, so the rating stays pinned to the right
                      edge instead of jumping over. */}
                  <div
                    className="absolute z-20 flex items-center justify-between"
                    style={{ top: badgeOffset, left: badgeOffset, right: badgeOffset }}
                  >
                    <span
                      className="flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-orange-400/30 shadow-sm"
                      style={{
                        width: fireBadgeSize,
                        height: fireBadgeSize,
                        visibility: isHot ? "visible" : "hidden",
                      }}
                      title="Hot"
                    >
                      {isHot && <FireIcon size={fireIconSize} />}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md font-bold text-amber-400 border border-amber-400/20 shadow-sm"
                      style={{
                        fontSize: ratingFontSize,
                        paddingLeft: badgePadX,
                        paddingRight: badgePadX,
                        paddingTop: badgePadY,
                        paddingBottom: badgePadY,
                      }}
                    >
                      <svg
                        className="fill-current"
                        viewBox="0 0 20 20"
                        style={{ width: ratingIconSize, height: ratingIconSize }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {m.vote_average?.toFixed(1) ?? "—"}
                    </span>
                  </div>
                </div>
              </BorderGlow>
            </div>
          );
        })}
      </div>
    </div>
  );
}