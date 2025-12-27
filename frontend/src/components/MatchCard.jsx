import { useState } from "react";

export default function MatchCard({ data }) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="bg-white rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 overflow-hidden relative group">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {data.user.avatar && (
            <img
              src={data.user.avatar}
              alt={data.user.name}
              className="w-14 h-14 rounded-full border-3 border-pink-200 shadow-md flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-purple-700 mb-1 group-hover:text-purple-800 transition-colors">
              {data.user.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{data.user.email}</p>
          </div>
          <div className="flex-shrink-0">
            <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg">
              {data.score.toFixed(1)}
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">Match</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {data.user.techStack && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <span className="text-xs font-semibold text-purple-700">Tech Stack:</span>
              <span className="text-sm text-purple-600 font-bold">{data.user.techStack}</span>
            </div>
          )}
          
          {data.user.dsaRating && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-medium text-gray-500">DSA Rating:</span>
              <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded-md text-xs font-semibold">
                {data.user.dsaRating}
              </span>
            </div>
          )}

          {data.user.skills && data.user.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {data.user.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-lg text-xs font-semibold border border-pink-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {data.explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full py-2 text-sm font-semibold text-purple-600 hover:text-pink-600 transition-colors border-t border-pink-100 pt-3"
          >
            {showExplanation ? "▲ Hide" : "▼ Show"} Match Explanation
          </button>
        )}

        {showExplanation && data.explanation && (
          <div className="mt-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <p className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2">
              <span>💡</span> Why this match?
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              {data.explanation.breakdown?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
