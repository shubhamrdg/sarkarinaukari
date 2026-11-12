export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-semibold text-slate-950">Sarkari<span className="text-blue-700">Naukri</span></p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Government jobs, results, and official links.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
          <a href="/category/job" className="hover:text-blue-700">Jobs</a>
          <a href="/category/result" className="hover:text-blue-700">Results</a>
          <a href="/category/admit-card" className="hover:text-blue-700">Admit Cards</a>
          <a href="/category/answer-key" className="hover:text-blue-700">Answer Keys</a>
          <a href="/category/syllabus" className="hover:text-blue-700">Syllabus</a>
          <a href="/about" className="hover:text-blue-700">About</a>
          <a href="/contact" className="hover:text-blue-700">Contact</a>
          <a href="/privacy-policy" className="hover:text-blue-700">Privacy</a>
          <a href="/disclaimer" className="hover:text-blue-700">Disclaimer</a>
        </div>
        <p className="text-xs text-slate-400">© 2026 SarkariNaukri</p>
      </div>
    </footer>
  );
}
