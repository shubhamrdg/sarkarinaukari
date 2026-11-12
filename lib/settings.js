import Settings from "../models/Settings.js";

export async function getSiteSettings() {
  return Settings.findOneAndUpdate(
    { key: "site" },
    { $setOnInsert: { key: "site", autoPublishScraped: false } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
}

export async function updateSiteSettings(values) {
  return Settings.findOneAndUpdate(
    { key: "site" },
    { $set: values },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
}
