"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-indigo-400">
          BuildGuard AI
        </Link>
        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
          <Link href="/dashboard" className="transition hover:text-slate-50">
            Dashboard
          </Link>
          <Link href="/upload" className="transition hover:text-slate-50">
            Upload
          </Link>
          <Link href="/pricing" className="transition hover:text-slate-50">
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
          >
            Login
          </Link>
        </nav>
        {/* Mobile hamburger */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-50 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-700 bg-slate-900 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-slate-400">
            <Link href="/dashboard" className="transition hover:text-slate-50" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link href="/upload" className="transition hover:text-slate-50" onClick={() => setMobileOpen(false)}>
              Upload
            </Link>
            <Link href="/pricing" className="transition hover:text-slate-50" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-white transition hover:bg-indigo-700"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
