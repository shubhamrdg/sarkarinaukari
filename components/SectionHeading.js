export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase text-blue-700">{eyebrow}</p>}
        <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
