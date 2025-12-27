import { getTodayInsight } from "../utils/insightGenerator.js";

export const getInsight = async (req, res) => {
  try {
    const insight = await getTodayInsight(req.userId);
    
    if (!insight) {
      return res.json({
        hasInsight: false,
        message: "Unable to generate insight at this time"
      });
    }

    // Check if insight has primaryInsight (valid insight object)
    if (insight.primaryInsight) {
      return res.json({
        hasInsight: true,
        primaryInsight: insight.primaryInsight,
        secondaryTip: insight.secondaryTip || null,
        expiresAt: insight.expiresAt
      });
    }

    // Fallback for edge cases
    res.json({
      hasInsight: false,
      message: "Complete your profile to get daily insights"
    });
  } catch (error) {
    console.error("Error fetching insight:", error);
    res.status(500).json({ message: error.message });
  }
};

