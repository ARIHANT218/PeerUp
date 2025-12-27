import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Optional link to group
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
