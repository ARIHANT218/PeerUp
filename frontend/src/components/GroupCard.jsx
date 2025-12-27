import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  const getStatusBadge = () => {
    const status = group.status || (group.members?.length >= group.capacity ? "FULL" : "OPEN");
    
    if (status === "OPEN") {
      return (
        <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200 shadow-sm">
          ✓ OPEN
        </span>
      );
    } else if (status === "LOCKED" || group.isLocked) {
      return (
        <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-200 shadow-sm">
          🔒 LOCKED
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
          FULL
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 overflow-hidden relative group">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-bold text-xl text-purple-700 group-hover:text-purple-800 transition-colors">
                {group.name}
              </h3>
              {getStatusBadge()}
            </div>
            {group.description && (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {group.techStack && (
            <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
              <span className="text-xs font-semibold text-purple-700">Tech Stack:</span>
              <span className="text-sm text-purple-600 font-bold">{group.techStack}</span>
            </div>
          )}

          {(group.dsaRatingMin || group.dsaRatingMax) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs font-medium text-gray-500">DSA Range:</span>
              <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded-md text-xs font-semibold">
                {group.dsaRatingMin || "Any"} - {group.dsaRatingMax || "Any"}
              </span>
            </div>
          )}

          {group.requiredSkills && group.requiredSkills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-gray-600 mb-2 block">Required Skills:</span>
              <div className="flex flex-wrap gap-2">
                {group.requiredSkills.map((skill, idx) => (
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

          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">
              {group.members?.length || 0} / {group.capacity} Members
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-pink-100">
          <div className="flex items-center gap-2">
            {group.creator?.avatar && (
              <img
                src={group.creator.avatar}
                alt={group.creator.name}
                className="w-8 h-8 rounded-full border-2 border-pink-200"
              />
            )}
            <div>
              <p className="text-xs text-gray-500">Created by</p>
              <p className="text-xs font-semibold text-gray-700">
                {group.creator?.name || "Unknown"}
              </p>
            </div>
          </div>
          <Link
            to={`/groups/${group._id}`}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 shadow-md"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

