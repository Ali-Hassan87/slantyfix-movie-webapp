import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * GooeyNav
 *
 * v2 changes:
 * - Removed the floating "text clone" layer. The real <li> content already
 *   renders above the blob (z-index 3 vs 1) and already gets its active
 *   color from CSS (`li.active { color: white }`), so cloning innerText
 *   into a second absolutely-positioned span was pure redundancy — and the
 *   cause of the duplicated/overflowing text when items had icons + a
 *   badge (plain innerText has no idea about flex/gap layout, so it just
 *   wrapped).
 * - `item.static` items (e.g. Search) report clicks via onChange but never
 *   own the blob/active state.
 * - Perf: heavy per-render closures wrapped in useCallback, particle burst
 *   respects prefers-reduced-motion, ResizeObserver callback is
 *   rAF-batched.
 *
 * v3 changes:
 * - The goo blob's underlying `.effect.filter::before` canvas (the black
 *   box behind the colored pill, required for the blur+contrast "gooey"
 *   trick) used a fixed `inset: -75px` bleed on every side. That canvas is
 *   sized to match the ACTIVE li's bounding box, which on mobile is a tiny
 *   icon-only button (~30px). A fixed 75px bleed around something that
 *   small is proportionally huge and visually smears past the nav pill
 *   into whatever sits nearby — in this app, the navbar logo text right
 *   next to it, making it look "cut off". Desktop never showed this
 *   because the active li there is a much bigger text+icon pill, so the
 *   same 75px bleed stays comfortably inside the glass container.
 *   Fixed by making the bleed a CSS custom property that's smaller on
 *   narrow screens, so the blob keeps its liquid look without spilling
 *   into neighboring UI. Particle bursts are untouched — they're a
 *   separate mechanism and still travel their full distance on click.
 */
const GooeyNav = ({
  items,
  activeIndex: controlledIndex,
  onChange,
  renderItem,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);

  const [internalIndex, setInternalIndex] = useState(initialActiveIndex);
  const isControlled = controlledIndex !== undefined && controlledIndex !== null;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = useCallback(
    element => {
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      const d = particleDistances;
      const r = particleR;
      const bubbleTime = animationTime * 2 + timeVariance;
      element.style.setProperty('--time', `${bubbleTime}ms`);
      for (let i = 0; i < particleCount; i++) {
        const t = animationTime * 2 + noise(timeVariance * 2);
        const p = createParticle(i, t, d, r);
        element.classList.remove('active');
        setTimeout(() => {
          const particle = document.createElement('span');
          const point = document.createElement('span');
          particle.classList.add('particle');
          particle.style.setProperty('--start-x', `${p.start[0]}px`);
          particle.style.setProperty('--start-y', `${p.start[1]}px`);
          particle.style.setProperty('--end-x', `${p.end[0]}px`);
          particle.style.setProperty('--end-y', `${p.end[1]}px`);
          particle.style.setProperty('--time', `${p.time}ms`);
          particle.style.setProperty('--scale', `${p.scale}`);
          particle.style.setProperty('--color', `var(--color-${p.color}, #ff6b4a)`);
          particle.style.setProperty('--rotate', `${p.rotate}deg`);
          point.classList.add('point');
          particle.appendChild(point);
          element.appendChild(particle);
          requestAnimationFrame(() => {
            element.classList.add('active');
          });
          setTimeout(() => {
            try {
              element.removeChild(particle);
            } catch {
              // do nothing
            }
          }, t);
        }, 30);
      }
    },
    [particleCount, particleDistances, particleR, timeVariance, animationTime, colors]
  );

  const updateEffectPosition = useCallback(element => {
    if (!containerRef.current || !filterRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    Object.assign(filterRef.current.style, {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    });
  }, []);

  const animateTo = useCallback(
    liEl => {
      updateEffectPosition(liEl);
      if (filterRef.current) {
        const particles = filterRef.current.querySelectorAll('.particle');
        particles.forEach(p => filterRef.current.removeChild(p));
        makeParticles(filterRef.current);
      }
    },
    [updateEffectPosition, makeParticles]
  );

  const handleClick = (e, index) => {
    e.preventDefault?.();
    const liEl = e.currentTarget;
    const item = items[index];

    // `static` items (e.g. a Search button that opens a modal) don't
    // represent a page — they should never own the goo blob or the
    // "active" state. Report the click and stop.
    if (item?.static) {
      onChange?.(index, item);
      return;
    }

    if (activeIndex === index) return;
    if (!isControlled) setInternalIndex(index);
    animateTo(liEl);
    onChange?.(index, item);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl, preventDefault: () => {} }, index);
      }
    }
  };

  // Reposition the blob whenever the active index changes — including
  // externally, e.g. a Next.js route change via back/forward.
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      filterRef.current?.classList.add('active');
    }

    let rafId = null;
    const resizeObserver = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
        if (currentActiveLi) updateEffectPosition(currentActiveLi);
      });
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [activeIndex, updateEffectPosition]);

  return (
    <>
      {/* This effect is quite difficult to recreate faithfully using Tailwind, so a style tag is a necessary workaround */}
      <style>
        {`
          .gooey-nav-root {
            /* orange -> red glass palette used by the goo blob + particles */
            --color-1: #ff9142;
            --color-2: #ff6b4a;
            --color-3: #ff3d3d;
            --color-4: #c81e3a;

            /* Bleed radius of the goo blob's blur canvas (see v3 note
               above). Smaller on narrow screens so it doesn't smear past
               the nav pill onto neighboring UI like the logo text. */
            --goo-bleed: 28px;
          }
          @media (min-width: 640px) {
            .gooey-nav-root { --goo-bleed: 50px; }
          }
          @media (min-width: 768px) {
            .gooey-nav-root { --goo-bleed: 75px; }
          }
          .gooey-nav-glass {
            background: linear-gradient(135deg, rgba(255,145,66,0.14), rgba(255,61,61,0.10));
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(255,120,80,0.25);
            box-shadow: 0 0 30px -8px rgba(255,80,40,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          }
          .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            z-index: 1;
          }
          .effect.filter {
            filter: blur(7px) contrast(100) blur(0);
            mix-blend-mode: lighten;
          }
          .effect.filter::before {
            content: "";
            position: absolute;
            inset: calc(-1 * var(--goo-bleed, 75px));
            z-index: -2;
            background: black;
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--color-1), var(--color-3));
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 20px;
            height: 20px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 8px);
            left: calc(50% - 8px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li:not(.active):hover {
            background-color: rgba(255, 255, 255, 0.07);
          }
          li:not(.active):active {
            background-color: rgba(255, 255, 255, 0.12);
          }
          li.active {
            color: white;
            text-shadow: none;
          }
          li.active::after {
            opacity: 1;
            transform: scale(1);
          }
          li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: linear-gradient(135deg, var(--color-1), var(--color-3));
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: -1;
          }
          @media (prefers-reduced-motion: reduce) {
            .particle { animation: none !important; opacity: 0 !important; }
            .effect.active::after { animation: none !important; }
            li::after { transition: none !important; }
          }
        `}
      </style>
      <div
        className="relative gooey-nav-root gooey-nav-glass rounded-full px-1 py-1 sm:px-1.5 sm:py-1.5"
        ref={containerRef}
      >
        <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            className="flex gap-0.5 sm:gap-1 list-none p-0 m-0 relative z-3"
            style={{
              color: 'white',
              textShadow: '0 1px 1px hsl(205deg 30% 10% / 0.2)'
            }}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`rounded-full relative cursor-pointer transition-colors duration-300 ease text-white ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <a
                  onClick={e => handleClick(e, index)}
                  href={item.href}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="outline-none py-2 px-2.5 sm:py-[0.55em] sm:px-[1em] inline-flex items-center whitespace-nowrap"
                >
                  {renderItem ? renderItem(item, index, activeIndex === index) : item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
      </div>
    </>
  );
};

export default GooeyNav;