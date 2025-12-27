import User from "../models/User.js";
import Group from "../models/Group.js";
import Insight from "../models/Insight.js";

const INSIGHT_TYPES = {
  SKILL_GAP: "skill_gap",
  MATCH_IMPROVEMENT: "match_improvement",
  PROGRESS: "progress",
  OPPORTUNITY: "opportunity"
};

export const generateDailyInsight = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  
  if (!user.isProfileComplete) {
    // Return a default insight for incomplete profiles
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    return await Insight.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        primaryInsight: {
          headline: "Complete your profile to unlock insights",
          explanation: "Add your skills and preferences to get personalized daily insights.",
          type: INSIGHT_TYPES.OPPORTUNITY,
          actionCTA: "Complete Profile",
          actionLink: "/onboarding"
        },
        expiresAt
      },
      { upsert: true, new: true }
    );
  }

  // Get all active users and groups for analysis
  const allUsers = await User.find({ 
    isProfileComplete: true,
    _id: { $ne: userId }
  });
  
  const allGroups = await Group.find({ status: "OPEN" });

  // Calculate match statistics
  const matchStats = calculateMatchStats(user, allUsers, allGroups);
  
  // Generate primary insight
  const primaryInsight = generatePrimaryInsight(user, matchStats, allGroups);
  
  // Generate optional secondary tip
  const secondaryTip = generateSecondaryTip(user, matchStats);

  // Store insight
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const insight = await Insight.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      primaryInsight,
      secondaryTip,
      expiresAt,
      metadata: {
        matchPercentage: matchStats.matchPercentage,
        skillGaps: matchStats.skillGaps,
        suggestedSkills: matchStats.suggestedSkills,
        matchCount: matchStats.matchCount
      }
    },
    { upsert: true, new: true }
  );

  return insight;
};

const calculateMatchStats = (user, allUsers, allGroups) => {
  let matchCount = 0;
  let totalUsers = allUsers.length;
  const skillFrequency = {};
  const missingSkills = new Set();

  // Analyze user matches
  allUsers.forEach(otherUser => {
    let hasMatch = false;
    
    // Check tech stack match
    if (user.techStack && otherUser.techStack && 
        user.techStack.toLowerCase() === otherUser.techStack.toLowerCase()) {
      hasMatch = true;
    }
    
    // Check skill overlap
    if (user.skills && otherUser.skills) {
      const userSkills = new Set(user.skills.map(s => s.toLowerCase()));
      const otherSkills = new Set(otherUser.skills.map(s => s.toLowerCase()));
      const overlap = [...userSkills].filter(s => otherSkills.has(s));
      if (overlap.length > 0) hasMatch = true;
      
      // Track missing skills
      [...otherSkills].forEach(skill => {
        if (!userSkills.has(skill)) {
          missingSkills.add(skill);
          skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        }
      });
    }
    
    if (hasMatch) matchCount++;
  });

  // Analyze group eligibility
  const eligibleGroups = allGroups.filter(group => {
    // Check DSA rating
    if (group.dsaRatingMin && user.dsaRating < group.dsaRatingMin) return false;
    if (group.dsaRatingMax && user.dsaRating > group.dsaRatingMax) return false;
    
    // Check tech stack
    if (group.techStack && user.techStack && 
        group.techStack.toLowerCase() !== user.techStack.toLowerCase()) return false;
    
    // Check required skills
    if (group.requiredSkills && group.requiredSkills.length > 0) {
      const userSkills = new Set((user.skills || []).map(s => s.toLowerCase()));
      const hasRequiredSkill = group.requiredSkills.some(skill => 
        userSkills.has(skill.toLowerCase())
      );
      if (!hasRequiredSkill) return false;
    }
    
    return true;
  });

  const matchPercentage = totalUsers > 0 ? Math.round((matchCount / totalUsers) * 100) : 0;
  
  // Get top missing skills
  const topMissingSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill);

  return {
    matchCount,
    matchPercentage,
    eligibleGroups: eligibleGroups.length,
    totalGroups: allGroups.length,
    skillGaps: Array.from(missingSkills),
    suggestedSkills: topMissingSkills
  };
};

const generatePrimaryInsight = (user, stats, allGroups) => {
  // Skill gap insight (highest priority)
  if (stats.suggestedSkills.length > 0 && stats.matchPercentage < 70) {
    const topSkill = stats.suggestedSkills[0];
    const skillName = topSkill.charAt(0).toUpperCase() + topSkill.slice(1);
    const potentialIncrease = Math.min(25, stats.matchPercentage + 15);
    
    return {
      headline: `Add ${skillName} to unlock ${potentialIncrease}% more matches`,
      explanation: `${skillName} is in high demand. Adding it could significantly improve your match potential.`,
      type: INSIGHT_TYPES.SKILL_GAP,
      actionCTA: "Add Skill",
      actionLink: "/onboarding"
    };
  }

  // Group opportunity insight
  if (stats.eligibleGroups < stats.totalGroups * 0.5 && stats.totalGroups > 0) {
    const missingCount = stats.totalGroups - stats.eligibleGroups;
    return {
      headline: `You're missing ${missingCount} group opportunities`,
      explanation: "Expanding your skill set could unlock access to more collaboration groups.",
      type: INSIGHT_TYPES.OPPORTUNITY,
      actionCTA: "View Groups",
      actionLink: "/groups"
    };
  }

  // Match improvement insight
  if (stats.matchPercentage >= 50 && stats.matchPercentage < 80) {
    return {
      headline: `Your skills match ${stats.matchPercentage}% of active students`,
      explanation: "You're in a good position! Consider adding complementary skills to reach even more peers.",
      type: INSIGHT_TYPES.MATCH_IMPROVEMENT,
      actionCTA: "Find Matches",
      actionLink: "/search"
    };
  }

  // High match percentage
  if (stats.matchPercentage >= 80) {
    return {
      headline: `Excellent! You match ${stats.matchPercentage}% of students 🎯`,
      explanation: "Your skill profile is well-aligned with the community. Keep up the great work!",
      type: INSIGHT_TYPES.PROGRESS,
      actionCTA: "Explore Groups",
      actionLink: "/groups"
    };
  }

  // Default for new users
  return {
    headline: "Complete your profile to get personalized insights",
    explanation: "Add your skills and preferences to unlock daily insights and better matches.",
    type: INSIGHT_TYPES.OPPORTUNITY,
    actionCTA: "Complete Profile",
    actionLink: "/onboarding"
  };
};

const generateSecondaryTip = (user, stats) => {
  if (!stats.suggestedSkills.length) return null;

  const tipSkill = stats.suggestedSkills[1] || stats.suggestedSkills[0];
  if (!tipSkill) return null;

  const skillName = tipSkill.charAt(0).toUpperCase() + tipSkill.slice(1);
  
  return {
    headline: `💡 Quick Tip`,
    explanation: `Learning ${skillName} could increase your group access by 15-20%`
  };
};

export const getTodayInsight = async (userId) => {
  try {
    const insight = await Insight.findOne({ user: userId });
    
    // Check if insight exists and is still valid
    if (insight && insight.expiresAt > new Date()) {
      return insight;
    }
    
    // Generate new insight if expired or doesn't exist
    return await generateDailyInsight(userId);
  } catch (error) {
    console.error("Error in getTodayInsight:", error);
    // If duplicate key error, fetch existing insight
    if (error.code === 11000) {
      return await Insight.findOne({ user: userId });
    }
    throw error;
  }
};

