import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const res = await api.get(`/groups/${id}`);
      setGroup(res.data);
    } catch (error) {
      console.error("Failed to fetch group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await api.post(`/groups/${id}/join`);
      setGroup(res.data);
      alert("Successfully joined the group!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;
    
    try {
      const res = await api.post(`/groups/${id}/leave`);
      setGroup(res.data);
      alert("Left the group successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to leave group");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) return;
    
    try {
      await api.delete(`/groups/${id}`);
      alert("Group deleted successfully");
      navigate("/groups");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete group");
    }
  };

  const isMember = group?.members?.some(m => 
    m._id === user?._id || m._id?.toString() === user?._id?.toString()
  );
  const isCreator = group?.creator?._id === user?._id || 
                    group?.creator?._id?.toString() === user?._id?.toString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-gray-600 text-lg">Group not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl card-shadow border border-pink-100 mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">{group.name}</h1>
              {group.description && (
                <p className="text-sm sm:text-base text-gray-600">{group.description}</p>
              )}
            </div>
            <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
              group.status === "OPEN" 
                ? "bg-green-100 text-green-700"
                : group.status === "LOCKED" || group.isLocked
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {group.status || "OPEN"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {group.techStack && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tech Stack:</span>
                <p className="text-purple-600 font-semibold">{group.techStack}</p>
              </div>
            )}

            {(group.dsaRatingMin || group.dsaRatingMax) && (
              <div>
                <span className="text-sm font-medium text-gray-500">DSA Rating Range:</span>
                <p className="text-gray-700">
                  {group.dsaRatingMin || "Any"} - {group.dsaRatingMax || "Any"}
                </p>
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-500">Capacity:</span>
              <p className="text-gray-700">{group.members?.length || 0} / {group.capacity}</p>
            </div>

            {group.requiredSkills && group.requiredSkills.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Required Skills:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {group.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-pink-100">
            {!isMember && group.status === "OPEN" && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 text-sm sm:text-base"
              >
                {joining ? "Joining..." : "Join Group"}
              </button>
            )}
            {isMember && !isCreator && (
              <button
                onClick={handleLeave}
                className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transform transition-all duration-200 text-sm sm:text-base"
              >
                Leave Group
              </button>
            )}
            {isCreator && (
              <>
                <button
                  onClick={() => navigate(`/chat/${group._id}`)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 text-sm sm:text-base"
                >
                  Open Chat
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transform transition-all duration-200 text-sm sm:text-base"
                >
                  Delete Group
                </button>
              </>
            )}
            {isMember && !isCreator && (
              <button
                onClick={() => navigate(`/chat/${group._id}`)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 text-sm sm:text-base"
              >
                Open Chat
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl card-shadow border border-pink-100">
          <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4 sm:mb-6">Members ({group.members?.length || 0})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {group.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg"
              >
                {member.avatar && (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-pink-200"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  {member.dsaRating && (
                    <p className="text-xs text-gray-600">DSA: {member.dsaRating}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

