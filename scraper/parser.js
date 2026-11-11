import crypto from "node:crypto";
import * as cheerio from "cheerio";

const NOISE_SELECTORS =
  "script, style, noscript, iframe, svg, nav, header, footer, .ads, .ad, [id*='ad-'], [class*='advert']";

const cleanText = (value) =>
  String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const absoluteUrl = (value, pageUrl) => {
  try {
    return new URL(value, pageUrl).toString();
  } catch {
    return "";
  }
};

const slugify = (value) =>
  cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180) || `post-${Date.now()}`;

function extractLabeledValue($, labels) {
  let value = "";
  $("body *").each((_, element) => {
    if (value) return;
    const text = cleanText($(element).text());
    const label = labels.find((candidate) => text.toLowerCase().startsWith(candidate));
    if (label && text.length > label.length) {
      value = cleanText(text.slice(label.length).replace(/^[:\-\s]+/, ""));
    }
  });
  return value;
}

function extractRows($, labels) {
  const rows = [];
  $("table tr").each((_, row) => {
    const cells = $(row)
      .find("th, td")
      .map((__, cell) => cleanText($(cell).text()))
      .get()
      .filter(Boolean);
    if (cells.length >= 2 && labels.some((label) => cells[0].toLowerCase().includes(label))) {
      rows.push({ label: cells[0], date: cells.slice(1).join(" - ") });
    }
  });
  return rows;
}

export function extractListingLinks(html, pageUrl) {
  const $ = cheerio.load(html);
  const links = new Map();
  $("a[href]").each((_, element) => {
    const title = cleanText($(element).text());
    const url = absoluteUrl($(element).attr("href"), pageUrl);
    if (!title || !url || !url.startsWith("https://www.sarkariresult.com")) return;
    if (url === pageUrl || title.length < 8) return;
    links.set(url, { title, url });
  });
  return [...links.values()];
}

export function extractPost(html, sourceUrl, category) {
  const $ = cheerio.load(html);
  $(NOISE_SELECTORS).remove();
  const title = cleanText($("h1").first().text() || $("title").text());
  const organization =
    extractLabeledValue($, ["organization", "department", "board", "authority"]) ||
    cleanText($("h2, h3").first().text()) ||
    "Government Organization";
  const importantDates = extractRows($, ["important date", "start date", "last date", "exam date"]);
  const fee = extractLabeledValue($, ["application fee", "exam fee", "fee"]);
  const ageLimit = extractLabeledValue($, ["age limit", "age relaxation"]);
  const eligibility = extractLabeledValue($, ["eligibility", "educational qualification", "qualification"]);
  const vacancyText = extractLabeledValue($, ["vacancy", "total post", "number of post"]);
  const vacancyTotal = vacancyText.match(/[\d,]+/)?.[0];
  const importantLinks = [];
  $("a[href]").each((_, element) => {
    const label = cleanText($(element).text());
    const url = absoluteUrl($(element).attr("href"), sourceUrl);
    if (label && url && !importantLinks.some((link) => link.url === url)) {
      importantLinks.push({ label, url });
    }
  });
  const content = $("main").first().html() || $("article").first().html() || $("body").html() || "";
  const normalized = JSON.stringify({ title, organization, importantDates, fee, ageLimit, vacancyText, eligibility, content });

  return {
    title,
    slug: slugify(title),
    category,
    organization,
    shortInfo: cleanText($("meta[name='description']").attr("content")) || title,
    content,
    importantDates,
    applicationFee: fee ? [{ category: "General", amount: fee }] : [],
    ageLimit,
    vacancyDetails: vacancyTotal
      ? [{ postName: "Total vacancies", total: Number(vacancyTotal.replace(/,/g, "")) }]
      : [],
    eligibility,
    importantLinks: importantLinks.slice(0, 30),
    sourceUrl,
    sourceHash: crypto.createHash("sha256").update(normalized).digest("hex")
  };
}
