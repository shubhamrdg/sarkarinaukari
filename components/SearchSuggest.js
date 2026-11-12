"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "./Icon";

export default function SearchSuggest() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }
    const timer = setTimeout(async () => {
      const response = await fetch(`/api/search/suggest?q=${encodeURIComponent(query)}`);
      if (!response.ok) return;
      setSuggestions(await response.json());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <form action="/search" method="get" className="flex items-center">
        <input
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-0 bg-transparent text-sm outline-none transition-all focus:w-40 sm:focus:w-52"
          placeholder="Search..."
          aria-label="Search posts"
        />
        <button type="submit" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700" aria-label="Search">
          <SearchIcon />
        </button>
      </form>
      {suggestions.length > 0 && (
        <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {suggestions.map((post) => (
            <a key={post.slug} href={`/post/${post.slug}`} className="block rounded-lg px-3 py-2 text-sm hover:bg-blue-50">
              <span className="block truncate font-semibold text-slate-900">{post.title}</span>
              <span className="block truncate text-xs text-slate-500">{post.organization}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
