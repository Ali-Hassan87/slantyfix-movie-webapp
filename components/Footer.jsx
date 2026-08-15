import Link from "next/link";
import { Film } from "lucide-react";
import Image from "next/image";

const navLinks = [
    { label: "Genres", href: "/genres" },
    { label: "Trending", href: "/" },
    { label: "Watchlist", href: "/watchlist" },
];

// Inline SVGs (lucide-react dropped brand/social icons in newer versions)
const InstagramIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
);

const TwitterIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2zm-1.2 18h1.9L7.4 4H5.3l12.4 16z" />
    </svg>
);

const GithubIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.19-3.37-1.19-.46-1.2-1.11-1.52-1.11-1.52-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
);

const socials = [
    { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
    { icon: TwitterIcon, href: "https://twitter.com", label: "Twitter" },
    { icon: GithubIcon, href: "https://github.com", label: "Github" },
];

export default function Footer() {
    return (
        <footer className="relative border-t border-white/10 bg-neutral-950 text-neutral-300">
            {/* subtle top glow, cinema-screen feel */}
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-amber-400/60 to-transparent" />

            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <Image
                                src="/images/icon.png"
                                alt=""
                                width={42}
                                height={42}
                                className="object-contain rounded-full shadow-[0_0_8px_rgba(255,220,0,0.9),0_0_18px_rgba(255,193,7,0.8),0_0_32px_rgba(255,70,0,0.75),0_0_55px_rgba(220,0,0,0.55)]"
                            />
                            <span className="text-xl font-semibold italic tracking-tight text-white">
                                Slanty<span className="text-amber-400">fix</span>
                            </span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                            Stories worth the popcorn — discover, track, and relive your favorite films and shows.
                        </p>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-neutral-400 transition-colors hover:text-amber-400"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Socials */}
                    <div className="flex gap-4">
                        {socials.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="rounded-full border border-white/10 p-2 text-neutral-400 transition-colors hover:border-amber-400/50 hover:text-amber-400"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-xs text-neutral-500">
                        © {new Date().getFullYear()} Slantyfix. Founded by Ali Hassan.
                    </p>

                    <a
                        href="https://silverloft.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-neutral-500 transition-colors hover:text-amber-400"
                    >
                        <span>Crafted by</span>
                        <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                            <Image
                                src="/images/silverloft.png"
                                alt=""
                                width={35}
                                height={40}
                                className="object-contain rounded-full shadow-[0_0_8px_rgba(255,220,0,0.9),0_0_18px_rgba(255,193,7,0.8),0_0_32px_rgba(255,70,0,0.75),0_0_55px_rgba(220,0,0,0.55)]"
                            />
                            SilverLoft
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
}