import User from "../models/User.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { dsaRating, skills, techStack } = req.body;
    
    const updateData = {};
    if (dsaRating !== undefined) updateData.dsaRating = Number(dsaRating);
    if (skills !== undefined) updateData.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
    if (techStack !== undefined) updateData.techStack = techStack;
    
    // Mark profile as complete if all required fields are present
    if (dsaRating && skills?.length > 0 && techStack) {
      updateData.isProfileComplete = true;
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
