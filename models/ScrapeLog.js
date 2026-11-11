import mongoose from "mongoose";

const scrapeLogSchema = new mongoose.Schema(
  {
    startedAt: { type: Date, required: true },
    finishedAt: { type: Date },
    status: { type: String, required: true, enum: ["running", "completed", "failed"] },
    newCount: { type: Number, default: 0, min: 0 },
    updatedCount: { type: Number, default: 0, min: 0 },
    errors: { type: [String], default: [] }
  },
  { timestamps: true }
);

const ScrapeLog =
  mongoose.models.ScrapeLog || mongoose.model("ScrapeLog", scrapeLogSchema);

export default ScrapeLog;
