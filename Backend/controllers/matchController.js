import User from "../models/User.js";
import { calculateMatchScore } from "../utils/matchAlgo.js";

export const findMatches = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
      isProfileComplete: true
    }).select("-__v");

    const matches = users
      .map(user => {
        const matchResult = calculateMatchScore(req.body, user);
        return {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            dsaRating: user.dsaRating,
            skills: user.skills,
            techStack: user.techStack
          },
          score: matchResult.score,
          explanation: matchResult.explanation
        };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
