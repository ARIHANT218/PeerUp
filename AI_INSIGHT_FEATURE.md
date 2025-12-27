# AI Skill Gap Insight Feature

## Overview
Daily personalized insights to increase DAU through micro-feedback and progress visibility.

## Implementation

### Backend
- **Model**: `Insight.js` - Stores daily insights per user with 24h expiration
- **Generator**: `insightGenerator.js` - Rule-based logic (AI-ready)
- **API**: `GET /api/insight` - Returns today's insight

### Frontend
- **Component**: `InsightCard.jsx` - Dashboard highlight card
- **Location**: Top of dashboard, below hero section

## Insight Types

1. **Skill Gap** 💡 - Missing skills blocking matches
2. **Match Improvement** 📈 - Current match percentage
3. **Progress** 🎯 - High performance recognition
4. **Opportunity** ✨ - Group access improvements

## Logic Flow

1. Check if user has valid insight (< 24h old)
2. If expired/missing, generate new insight:
   - Analyze user skills vs. all users
   - Calculate match statistics
   - Identify skill gaps
   - Generate primary insight + optional tip
3. Store with 24h expiration
4. Return to frontend

## Edge Cases Handled

- **New users**: Prompt to complete profile
- **Incomplete profiles**: Default onboarding insight
- **No matches**: Suggest skill additions
- **High performers**: Positive reinforcement
- **Expired insights**: Auto-regenerate

## Future AI Evolution

Current rule-based system can be replaced with:
- LLM-based insight generation
- Personalized learning paths
- Predictive skill recommendations
- Behavioral pattern analysis

Structure allows seamless swap of `insightGenerator.js` logic.

