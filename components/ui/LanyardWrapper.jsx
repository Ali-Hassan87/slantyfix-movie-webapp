// "use client";

// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";

// const Lanyard = dynamic(() => import("@/components/ui/Lanyard"), {
//   ssr: false,
//   loading: () => (
//     <div className="w-full h-full animate-pulse bg-gradient-to-b from-transparent via-orange-500/5 to-transparent rounded-full" />
//   ),
// });

// export default function LanyardWrapper() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     const id = requestAnimationFrame(() => setMounted(true));
//     return () => cancelAnimationFrame(id);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <aside
//       aria-label="Decorative lanyard"
//       className="fixed z-30 pointer-events-none
//         top-14 -left-1 w-[100px] h-[200px]
//         sm:top-16 sm:left-0 sm:w-[130px] sm:h-[260px]
//         md:top-16 md:left-1 md:w-[160px] md:h-[320px]
//         lg:top-16 lg:left-3 lg:w-[200px] lg:h-[400px]
//         xl:left-5 xl:w-[240px] xl:h-[480px]
//         2xl:left-6 2xl:w-[260px] 2xl:h-[520px]"
//     >
//       <div className="w-full h-full pointer-events-auto">
//         <Lanyard
//           position={[0, 0, 18]}
//           gravity={[0, -20, 0]}
//           frontImage="/spiderman.png"
//           imageFit="cover"
//           lanyardWidth={0.6}
//           fov={28}
//         />
//       </div>
//     </aside>
//   );
// }