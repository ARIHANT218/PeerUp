import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    avatar: String,

    
    dsaRating: Number,
    skills: [String],
    techStack: String,

    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
