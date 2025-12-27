import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    type: { type: String, enum: ["text", "system"], default: "text" }
  },
  { timestamps: true }
);

// Index for efficient querying
messageSchema.index({ room: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);

