import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    primaryInsight: {
      headline: { type: String, required: true },
      explanation: { type: String, required: true },
      type: { type: String, enum: ["skill_gap", "match_improvement", "progress", "opportunity"], required: true },
      actionCTA: { type: String },
      actionLink: { type: String }
    },
    secondaryTip: {
      headline: String,
      explanation: String
    },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }, // 24 hours from generation
    metadata: {
      matchPercentage: Number,
      skillGaps: [String],
      suggestedSkills: [String],
      matchCount: Number
    }
  },
  { timestamps: true }
);

// Index for efficient queries - unique per user
insightSchema.index({ user: 1 }, { unique: true });
insightSchema.index({ expiresAt: 1 });

export default mongoose.model("Insight", insightSchema);

