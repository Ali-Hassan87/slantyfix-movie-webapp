'use client';

import dynamic from 'next/dynamic';

// ogl uses WebGL/canvas -> must be client-only, no SSR
const Lightfall = dynamic(() => import('@/components/ui/Lightfall'), {
  ssr: false,
  loading: () => null
});

export default function LightfallBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundColor: '#000000' }}
    >
      <Lightfall
        colors={['#F97316', '#FB923C', '#DC2626', '#FBBF24']}
        backgroundColor="#1a0500"
        speed={0.45}
        streakCount={3}
        streakWidth={1}
        streakLength={1.1}
        glow={1}
        density={0.5}
        twinkle={0.8}
        zoom={3}
        backgroundGlow={0.35}
        opacity={0.55}
        mouseInteraction={true}
        mouseStrength={0.35}
        mouseRadius={1}
        mouseDampening={0.2}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1}
      />
    </div>
  );
}