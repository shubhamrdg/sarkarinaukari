import sanitizeHtml from "sanitize-html";

export function sanitizePostHtml(value) {
  return sanitizeHtml(String(value || ""), {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "ol", "ul", "li",
      "h2", "h3", "h4", "blockquote", "a", "table", "thead", "tbody",
      "tr", "th", "td"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noreferrer noopener", target: "_blank" })
    }
  });
}
