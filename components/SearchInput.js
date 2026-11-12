"use client";

import { useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "./Icon";

export default function SearchInput({ defaultValue = "", action = "/search", label = "Search government updates" }) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  function onKeyDown(event) {
    if (event.key === "Escape") {
      setValue("");
      inputRef.current?.focus();
    }
  }

  return (
    <form action={action} method="get" className="flex min-h-11 items-center gap-2 border border-[var(--border-default)] bg-[var(--surface-raised)] p-1.5 focus-within:border-[var(--accent)]">
      <SearchIcon className="ml-2 size-5 shrink-0 text-[var(--text-secondary)]" />
      <label className="sr-only" htmlFor="site-search">{label}</label>
      <input id="site-search" ref={inputRef} name="q" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[var(--text-primary)] outline-none" placeholder="Search jobs, results, organizations" />
      {value && <button type="button" onClick={() => setValue("")} className="rounded p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]" aria-label="Clear search"><CloseIcon className="size-4" /></button>}
      <button type="submit" className="site-button site-button--primary text-sm">Search</button>
    </form>
  );
}
