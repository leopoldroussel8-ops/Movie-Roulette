"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-[75dvh] flex-col items-center justify-center text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="meta mb-5"
      >
        One movie at a time
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="text-5xl font-extrabold tracking-tighter sm:text-7xl"
      >
        Movie <span className="text-tungsten">Roulette</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18 }}
        className="mt-4 max-w-md text-lg text-mist"
      >
        Stop scrolling. Start watching.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10"
      >
        <Link
          href="/roulette"
          className="btn btn-primary px-10 py-4 text-lg shadow-[0_0_60px_-10px_rgba(230,169,78,0.55)]"
        >
          Find my movie
        </Link>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 max-w-xs text-sm text-mist"
      >
        Pick a mood, spin the deck, swipe until something clicks. Your
        watchlist stays on this device — no account needed.
      </motion.p>
    </div>
  );
}
