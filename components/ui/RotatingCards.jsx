"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BorderGlow from "./BorderGlow";

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
      });
    };

    computeDims();
    window.addEventListener("resize", computeDims);
    return () => window.removeEventListener("resize", computeDims);
  }, [radiusProp, cardWidthProp, cardHeightProp]);

  const { radius, cardWidth, cardHeight } = dims;

  const count = movies.length;
  const step = count > 0 ? 360 / count : 0;
  const degPerMs = 360 / (duration * 1000);

  const infoHeight = Math.max(Math.round(cardHeight * 0.2), 34);
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
        {movies.map((m, i) => (
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
              <div className="flex flex-col h-full">
                <div
                  className="relative w-full overflow-hidden rounded-t-[12px] bg-surface2"
                  style={{ height: posterHeight }}
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
                    <div className="w-full h-full flex items-center justify-center text-muted text-xs bg-surface2 p-2 text-center">
                      {m.title}
                    </div>
                  )}

                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-400/20 shadow-sm">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {m.vote_average?.toFixed(1) ?? "—"}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center px-2.5 bg-[#16121e] rounded-b-[12px]"
                  style={{ height: infoHeight }}
                >
                  <h3 className="font-body text-xs font-bold text-paper line-clamp-2 leading-snug">
                    {m.title}
                  </h3>
                </div>
              </div>
            </BorderGlow>
          </div>
        ))}
      </div>
    </div>
  );
}