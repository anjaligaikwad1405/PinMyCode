"use client";

import { useState } from "react";

const navLinks = [
  { href: "#search", label: "Search" },
  { href: "#reverse", label: "Reverse PIN" },
  { href: "#detect", label: "Detect" },
  { href: "#address", label: "Address" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900"
          href="#top"
        >
        
          PinMyCode
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:hidden"
          onClick={() => setOpen(!open)}
          type="button"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 4.5l9 9M13.5 4.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-2 sm:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
