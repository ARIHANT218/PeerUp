import Group from "../models/Group.js";
import User from "../models/User.js";

export const createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      requiredSkills,
      techStack,
      dsaRatingMin,
      dsaRatingMax,
      capacity
    } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ message: "Name and capacity are required" });
    }

    const creator = await User.findById(req.userId);
    if (!creator || !creator.isProfileComplete) {
      return res.status(400).json({ message: "Complete your profile first" });
    }

    const group = await Group.create({
      name,
      description,
      creator: req.userId,
      members: [req.userId],
      requiredSkills: requiredSkills || [],
      techStack,
      dsaRatingMin,
      dsaRatingMax,
      capacity: parseInt(capacity)
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email avatar")
      .populate("members", "name email avatar dsaRating skills techStack");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const { status, techStack, skill } = req.query;
    const query = {};

    if (status) query.status = status;
    if (techStack) query.techStack = techStack;
    if (skill) query.requiredSkills = { $in: [skill] };

    const groups = await Group.find(query)
      .populate("creator", "name email avatar")
      .populate("members", "name email avatar dsaRating skills techStack")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("creator", "name email avatar dsaRating skills techStack")
      .populate("members", "name email avatar dsaRating skills techStack");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.isProfileComplete) {
      return res.status(400).json({ message: "Complete your profile first" });
    }

    if (!group.canJoin(user)) {
      return res.status(400).json({ 
        message: `Cannot join group. Status: ${group.status}` 
      });
    }

    // Check if user meets group requirements
    if (group.dsaRatingMin && user.dsaRating < group.dsaRatingMin) {
      return res.status(400).json({ 
        message: `DSA rating must be at least ${group.dsaRatingMin}` 
      });
    }
    if (group.dsaRatingMax && user.dsaRating > group.dsaRatingMax) {
      return res.status(400).json({ 
        message: `DSA rating must be at most ${group.dsaRatingMax}` 
      });
    }
    if (group.requiredSkills.length > 0) {
      const hasRequiredSkill = group.requiredSkills.some(skill =>
        user.skills?.some(userSkill => 
          userSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      if (!hasRequiredSkill) {
        return res.status(400).json({ 
          message: "You don't meet the required skills" 
        });
      }
    }

    group.members.push(req.userId);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email avatar")
      .populate("members", "name email avatar dsaRating skills techStack");

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() === req.userId.toString()) {
      return res.status(400).json({ 
        message: "Creator cannot leave the group. Delete it instead." 
      });
    }

    group.members = group.members.filter(
      member => member.toString() !== req.userId.toString()
    );
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate("creator", "name email avatar")
      .populate("members", "name email avatar dsaRating skills techStack");

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.creator.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Only creator can delete group" });
    }

    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

