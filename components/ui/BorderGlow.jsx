"use client";

import { useRef, useEffect, useCallback } from "react";

function parseColorTriplet(str, fallback = "40 80 80") {
  const src = str || fallback;
  const match = src.match(/([\d.]+)\D+([\d.]+)%?\D+([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

const BorderGlow = ({
  children,
  className = "",
  borderRadius = 28,
  borderWidth = 2,
  glowColor = "40 80 80",
  glowIntensity = 1,
  glowRadius = 40,
  backgroundColor = "#120F17",
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0,
  alwaysOn = false,
  spinDuration = 6,
}) => {
  const ref = useRef(null);
  const { h, s, l } = parseColorTriplet(glowColor);
  const shadowColor = `hsl(${h}deg ${s}% ${l}% / ${Math.min(glowIntensity * 45, 100)}%)`;
  const gradientStops = [...colors, colors[0]].join(", ");

  // Hover fallback — sirf tab wire hota hai jab alwaysOn false ho
  const handlePointerMove = useCallback((e) => {
    if (alwaysOn) return;
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;
    card.style.setProperty("--border-angle", `${angle}deg`);
  }, [alwaysOn]);

  // Off-screen cards pe animation pause — asli grid-scale perf win
  useEffect(() => {
    if (!alwaysOn || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [alwaysOn]);

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className={`relative isolate overflow-hidden ${alwaysOn ? "animate-border-spin" : ""} ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        background: `conic-gradient(from var(--border-angle, 0deg), ${gradientStops})`,
        boxShadow: `0 0 ${glowRadius}px -4px ${shadowColor}`,
        animationDuration: alwaysOn ? `${spinDuration}s` : undefined,
        contain: "layout paint style",
      }}
    >
      <div
        className="relative h-full w-full"
        style={{
          borderRadius: `${Math.max(borderRadius - borderWidth, 0)}px`,
          background:
            fillOpacity > 0
              ? `linear-gradient(hsl(${h}deg ${s}% ${l}% / ${fillOpacity}), hsl(${h}deg ${s}% ${l}% / ${fillOpacity})), ${backgroundColor}`
              : backgroundColor,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;