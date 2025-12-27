import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/Message.js";
import Group from "../models/Group.js";

export const createRoom = async (req, res) => {
  try {
    const { groupId, name } = req.body;

    if (groupId) {
      // Create room for a group
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Check if user is a member
      if (!group.members.some(m => m.toString() === req.userId.toString())) {
        return res.status(403).json({ message: "Not a group member" });
      }

      // Check if room already exists
      let room = await ChatRoom.findOne({ group: groupId });
      if (room) {
        return res.json(room);
      }

      room = await ChatRoom.create({
        name: name || group.name,
        group: groupId,
        members: group.members,
        isPrivate: true
      });
    } else {
      // Create direct message room
      if (!name) {
        return res.status(400).json({ message: "Room name is required" });
      }

      const room = await ChatRoom.create({
        name,
        members: [req.userId],
        isPrivate: false
      });

      return res.status(201).json(room);
    }

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate("members", "name email avatar");

    res.status(201).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      members: req.userId
    })
      .populate("members", "name email avatar")
      .populate("group", "name")
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id)
      .populate("members", "name email avatar")
      .populate("group", "name");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a member
    if (!room.members.some(m => m._id.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not a room member" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a member
    if (!room.members.some(m => m.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not a room member" });
    }

    const messages = await Message.find({ room: req.params.id })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const room = await ChatRoom.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user is a member
    if (!room.members.some(m => m.toString() === req.userId.toString())) {
      return res.status(403).json({ message: "Not a room member" });
    }

    const message = await Message.create({
      room: req.params.id,
      sender: req.userId,
      content: content.trim(),
      type: "text"
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email avatar");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

