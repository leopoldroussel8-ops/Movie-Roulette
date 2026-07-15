"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/roulette", label: "Roulette" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/watched", label: "Watched" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-ivory"
        >
          Movie <span className="text-tungsten">Roulette</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-raised text-ivory"
                    : "text-mist hover:text-ivory"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
