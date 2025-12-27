import { Link } from "react-router-dom";

export default function InsightCard({ insight }) {
  if (!insight || !insight.hasInsight) {
    return null;
  }

  const getEmoji = (type) => {
    switch (type) {
      case "skill_gap": return "💡";
      case "match_improvement": return "📈";
      case "progress": return "🎯";
      case "opportunity": return "✨";
      default: return "💡";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow border border-pink-100 mb-6 relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-2xl">
          {getEmoji(insight.primaryInsight?.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-purple-700">Today's Insight</h3>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
              Daily
            </span>
          </div>
          
          <p className="text-gray-800 text-base font-semibold mb-2">
            {insight.primaryInsight?.headline}
          </p>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {insight.primaryInsight?.explanation}
          </p>
          
          {insight.primaryInsight?.actionCTA && (
            <Link
              to={insight.primaryInsight.actionLink || "#"}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-md"
            >
              {insight.primaryInsight.actionCTA}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {insight.secondaryTip && (
        <div className="mt-5 pt-5 border-t border-pink-100 bg-purple-50 rounded-lg p-4 -mx-2 -mb-2">
          <div className="flex items-start gap-2">
            <span className="text-lg">{getEmoji(insight.primaryInsight?.type)}</span>
            <div>
              <p className="text-sm font-semibold text-purple-700 mb-1">
                {insight.secondaryTip.headline}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                {insight.secondaryTip.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

