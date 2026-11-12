"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to sign in.");
      setPending(false);
      return;
    }
    const next = searchParams.get("next");
    router.replace(next?.startsWith("/admin") ? next : "/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">SarkariNaukri</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Use your administrator credentials to continue.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">Email
          <input type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">Password
          <input type="password" required minLength={8} maxLength={200} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500" />
        </label>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button disabled={pending} className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Signing in..." : "Sign in"}</button>
      </form>
    </main>
  );
}
