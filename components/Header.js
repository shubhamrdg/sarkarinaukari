"use client";

import { useState } from "react";
import { CloseIcon, MenuIcon } from "./Icon";
import SearchSuggest from "./SearchSuggest";

const categories = [
  ["Home", ""],
  ["Jobs", "job"],
  ["Results", "result"],
  ["Admit Card", "admit-card"],
  ["Answer Key", "answer-key"],
  ["Syllabus", "syllabus"],
  ["Admission", "admission"],
  ["Important", "important"]
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
          Sarkari<span className="text-blue-700">Naukri</span>
        </a>
        <div className="flex items-center gap-1">
          <SearchSuggest />
          <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700 md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <nav className={`${menuOpen ? "block" : "hidden"} border-t border-slate-100 md:block`} aria-label="Main navigation">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {categories.map(([label, slug]) => (
            <a key={slug || "home"} href={slug ? `/category/${slug}` : "/"} className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--link-hover)]">
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
