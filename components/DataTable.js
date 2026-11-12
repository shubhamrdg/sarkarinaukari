export default function DataTable({ caption, headers, rows }) {
  if (!rows?.length) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-[34rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>{headers.map((header, index) => <th key={header} className={`${index === 0 ? "sticky left-0 bg-slate-50" : ""} whitespace-nowrap px-4 py-3`}>{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">{rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td key={cellIndex} className={`${cellIndex === 0 ? "sticky left-0 bg-white font-medium" : ""} whitespace-nowrap px-4 py-3 text-slate-700`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
