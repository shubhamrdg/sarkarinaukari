import Footer from "./Footer";
import Header from "./Header";

export default function StaticPage({ title, intro, children }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-blue-700">SarkariNaukri</p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        {intro && <p className="mt-4 text-pretty leading-7 text-slate-600">{intro}</p>}
        <div className="mt-10 space-y-8 text-pretty text-sm leading-7 text-slate-600">{children}</div>
      </main>
      <Footer />
    </>
  );
}
