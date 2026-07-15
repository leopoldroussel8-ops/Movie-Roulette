import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Movie Roulette — Stop scrolling. Start watching.",
  description:
    "Pick your mood, spin the roulette, get one movie at a time. Save it, skip it, or watch it tonight.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="vignette min-h-dvh">
        <Nav />
        <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
