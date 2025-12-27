import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isProfileComplete: true });
    const totalMatches = await User.countDocuments(); // Simplified for now
    
    res.json({
      totalUsers,
      totalMatches,
      activeUsers: totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
