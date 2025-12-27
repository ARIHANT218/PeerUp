import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
    // Skill-based filters
    requiredSkills: [String],
    techStack: String,
    dsaRatingMin: Number,
    dsaRatingMax: Number,
    
    // Group settings
    capacity: { type: Number, required: true, min: 2, max: 50 },
    isLocked: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ["OPEN", "LOCKED", "FULL"], 
      default: "OPEN" 
    }
  },
  { timestamps: true }
);

// Virtual for member count
groupSchema.virtual("memberCount").get(function() {
  return this.members.length;
});

// Method to check if user can join
groupSchema.methods.canJoin = function(user) {
  if (this.isLocked || this.status === "LOCKED") return false;
  if (this.members.length >= this.capacity) return false;
  if (this.members.some(m => m.toString() === user._id.toString())) return false;
  return true;
};

// Auto-update status based on capacity
groupSchema.pre("save", function(next) {
  if (this.members.length >= this.capacity) {
    this.status = "FULL";
  } else if (this.isLocked) {
    this.status = "LOCKED";
  } else {
    this.status = "OPEN";
  }
  next();
});

export default mongoose.model("Group", groupSchema);

