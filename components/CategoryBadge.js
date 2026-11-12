const labels = {
  job: "Jobs",
  result: "Results",
  "admit-card": "Admit Card",
  "answer-key": "Answer Key",
  syllabus: "Syllabus",
  admission: "Admission",
  important: "Important"
};

export default function CategoryBadge({ category }) {
  return (
    <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
      {labels[category] || category}
    </span>
  );
}
