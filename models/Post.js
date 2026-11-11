import mongoose from "mongoose";

const importantDateSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const applicationFeeSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    amount: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const vacancyDetailSchema = new mongoose.Schema(
  {
    postName: { type: String, required: true, trim: true },
    total: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const importantLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["job", "result", "admit-card", "answer-key", "syllabus", "admission", "important"],
      index: true
    },
    organization: { type: String, required: true, trim: true },
    shortInfo: { type: String, required: true, trim: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    importantDates: { type: [importantDateSchema], default: [] },
    applicationFee: { type: [applicationFeeSchema], default: [] },
    ageLimit: { type: String, default: "" },
    vacancyDetails: { type: [vacancyDetailSchema], default: [] },
    eligibility: { type: String, default: "" },
    importantLinks: { type: [importantLinkSchema], default: [] },
    sourceUrl: { type: String, default: "", trim: true },
    sourceHash: { type: String, default: "", trim: true },
    isPublished: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

postSchema.index({ title: "text", organization: "text" });
postSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
