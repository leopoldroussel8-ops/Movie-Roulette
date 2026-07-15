"use client";

import Link from "next/link";
import { useState } from "react";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-3 py-24 text-mist"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-tungsten" />
      <span className="meta">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-24 text-center">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm text-mist">{body}</p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="btn btn-primary mt-3 px-5 py-2.5 text-sm">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-24 text-center">
      <p className="text-lg font-semibold">Something broke the reel</p>
      <p className="text-sm text-mist">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-ghost mt-3 px-5 py-2.5 text-sm">
          Try again
        </button>
      )}
    </div>
  );
}

export function Stars({
  value,
  onChange,
  size = "text-xl",
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: string;
  label?: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div
      role="radiogroup"
      aria-label={label ?? "Rate from 1 to 5 stars"}
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const lit = n <= (hover || value);
        return (
          <button
            key={n}
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n === value ? 0 : n)}
            onMouseEnter={() => setHover(n)}
            className={`${size} leading-none transition-colors ${
              lit ? "text-tungsten" : "text-line"
            } hover:scale-110`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
