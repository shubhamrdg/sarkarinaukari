"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  if (pathname === "/admin/login") return children;

  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (!response.ok) return;
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-slate-50 md:flex">
      <aside className={`${open ? "block" : "hidden"} border-b border-slate-200 bg-white p-4 md:block md:w-64 md:border-b-0 md:border-r`}>
        <a href="/admin" className="text-lg font-bold text-slate-950">Sarkari<span className="text-blue-700">Naukri</span></a>
        <nav className="mt-8 space-y-1" aria-label="Admin navigation">
          <a href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Dashboard</a>
          <a href="/admin/posts" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Posts</a>
          <a href="/admin/review" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Review queue</a>
          <a href="/admin/scraper" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Scraper</a>
          <a href="/admin/settings" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">Settings</a>
        </nav>
        <button type="button" onClick={logout} className="mt-8 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700">Log out</button>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button type="button" onClick={() => setOpen(!open)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">Menu</button>
          <span className="text-sm font-semibold text-slate-900">Admin</span>
        </header>
        {children}
      </div>
    </div>
  );
}
