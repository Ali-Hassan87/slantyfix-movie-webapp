"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useWatchlist } from "@/hooks/useWatchlist";
import SearchModal from "@/components/SearchModal";
import GooeyNav from "@/components/ui/GooeyNav";
import Image from "next/image";

// Central place to add/remove nav items.
// `action: "search"` + `static: true` → doesn't navigate, doesn't own the
// goo blob/active state. GooeyNav just tells us it was clicked.
const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/", icon: "home" },
  { key: "genres", label: "Genres", href: "/genres", icon: "genres" },
  { key: "search", label: "Search", action: "search", static: true, icon: "search" },
  { key: "watchlist", label: "Watchlist", href: "/watchlist", icon: "watchlist" },
];

function Icon({ type }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (type) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 9 9-7 9 7" />
          <path d="M9 22V12h6v10" />
          <path d="M21 22H3" />
        </svg>
      );
    case "genres":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case "watchlist":
      return (
        <svg {...common}>
          <path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { watchlistIds } = useWatchlist();
  const watchlistCount = watchlistIds.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl + K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the goo blob synced with the actual route (covers direct loads,
  // back/forward nav, and links clicked from anywhere else on the page).
  const activeIndex = useMemo(() => {
    const idx = NAV_ITEMS.findIndex((item) => item.href && item.href === pathname);
    return idx === -1 ? 0 : idx;
  }, [pathname]);

  const handleNavChange = useCallback(
    (index) => {
      const navItem = NAV_ITEMS[index];
      if (navItem.action === "search") {
        setSearchOpen(true);
        return;
      }
      if (navItem.href) router.push(navItem.href);
    },
    [router]
  );

  // GooeyNav only needs label/href/static for its own bookkeeping — the
  // actual visuals come from `renderItem` below. Memoized so GooeyNav
  // doesn't see a new array identity on every Navbar render.
  const gooeyItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        label: item.label,
        href: item.href || "#",
        static: !!item.static,
      })),
    []
  );

  const renderNavItem = useCallback(
    (_item, index) => {
      const navItem = NAV_ITEMS[index];
      return (
        <span className="flex items-center gap-1.5 font-mono text-[12px] sm:text-[13px] tracking-wider uppercase whitespace-nowrap">
          <Icon type={navItem.icon} />
          <span className="hidden md:inline">{navItem.label}</span>
          {navItem.key === "watchlist" && watchlistCount > 0 && (
            <span className="flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold leading-none shrink-0">
              {watchlistCount > 99 ? "99+" : watchlistCount}
            </span>
          )}
        </span>
      );
    },
    [watchlistCount]
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ink/30 backdrop-blur-md" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 no-underline shrink-0">
            <motion.span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              animate={{
                boxShadow: [
                  "0 0 6px rgba(255,107,74,0.5)",
                  "0 0 14px rgba(255,107,74,0.9)",
                  "0 0 6px rgba(255,107,74,0.5)",
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <Image
              src="/images/icon.png"
              alt=""
              width={42}
              height={42}
              className="object-contain rounded-full shadow-[0_0_8px_rgba(255,220,0,0.9),0_0_18px_rgba(255,193,7,0.8),0_0_32px_rgba(255,70,0,0.75),0_0_55px_rgba(220,0,0,0.55)]"
            />
            <span className="font-display text-lg sm:text-2xl tracking-wide text-paper whitespace-nowrap [text-shadow:0_0_6px_rgba(255,193,7,0.95),0_0_14px_rgba(255,193,7,0.85),0_0_28px_rgba(255,174,0,0.7),0_0_50px_rgba(255,140,0,0.5)]">
              Slantyfix
            </span>
          </Link>

          <GooeyNav
            items={gooeyItems}
            activeIndex={activeIndex}
            onChange={handleNavChange}
            particleCount={14}
            particleDistances={[70, 10]}
            particleR={90}
            animationTime={550}
            timeVariance={250}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            renderItem={renderNavItem}
          />
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}