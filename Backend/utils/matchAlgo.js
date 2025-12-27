/**
 * Explainable Matching Algorithm
 * Calculates similarity score based on:
 * 1. Skill overlap (highest weight: 5 points per matching skill)
 * 2. Tech stack match (3 points)
 * 3. DSA rating proximity (penalty based on difference)
 * 
 * Returns: { score, explanation }
 */
export const calculateMatchScore = (search, user) => {
  let score = 0;
  const explanation = {
    skillMatches: [],
    techStackMatch: false,
    dsaRatingDiff: null,
    breakdown: []
  };

  // 1. Skill overlap (highest weight)
  if (search.skills?.length && user.skills?.length) {
    const userSkillsSet = new Set(user.skills.map(s => s.toLowerCase().trim()));
    const matchingSkills = search.skills.filter(skill => 
      userSkillsSet.has(skill.toLowerCase().trim())
    );
    
    matchingSkills.forEach(skill => {
      score += 5;
      explanation.skillMatches.push(skill);
      explanation.breakdown.push(`+5 points: Matching skill "${skill}"`);
    });
  }

  // 2. Tech stack match
  if (search.techStack && user.techStack) {
    if (search.techStack.toLowerCase().trim() === user.techStack.toLowerCase().trim()) {
      score += 3;
      explanation.techStackMatch = true;
      explanation.breakdown.push(`+3 points: Matching tech stack "${user.techStack}"`);
    }
  }

  // 3. DSA rating proximity (penalty for large differences)
  if (search.dsaRating && user.dsaRating) {
    const diff = Math.abs(search.dsaRating - user.dsaRating);
    const penalty = diff / 100; // 1 point penalty per 100 rating difference
    score -= penalty;
    explanation.dsaRatingDiff = diff;
    if (penalty > 0) {
      explanation.breakdown.push(`-${penalty.toFixed(2)} points: DSA rating difference of ${diff}`);
    } else {
      explanation.breakdown.push(`+0 points: Perfect DSA rating match`);
    }
  }

  // Ensure score is non-negative
  score = Math.max(0, score);

  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimal places
    explanation
  };
};
