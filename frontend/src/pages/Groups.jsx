import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Groups() {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    requiredSkills: "",
    techStack: "",
    dsaRatingMin: "",
    dsaRatingMax: "",
    capacity: "10"
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/groups");
      setGroups(res.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const groupData = {
        ...form,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map(s => s.trim()).filter(s => s)
          : [],
        dsaRatingMin: form.dsaRatingMin ? Number(form.dsaRatingMin) : undefined,
        dsaRatingMax: form.dsaRatingMax ? Number(form.dsaRatingMax) : undefined,
        capacity: Number(form.capacity)
      };

      const res = await api.post("/groups", groupData);
      setGroups([res.data, ...groups]);
      setShowCreateForm(false);
      setForm({
        name: "",
        description: "",
        requiredSkills: "",
        techStack: "",
        dsaRatingMin: "",
        dsaRatingMax: "",
        capacity: "10"
      });
    } catch (error) {
      console.error("Failed to create group:", error);
      alert(error.response?.data?.message || "Failed to create group");
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-2">Study Groups</h1>
            <p className="text-sm sm:text-base text-gray-600">Join or create skill-based collaboration groups</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 text-sm sm:text-base"
          >
            {showCreateForm ? "Cancel" : "+ Create Group"}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl card-shadow border border-pink-100 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4 sm:mb-6">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., React Study Group"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="2"
                    max="50"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="3"
                  placeholder="What will this group focus on?"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    value={form.techStack}
                    onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., MERN, Python"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={form.requiredSkills}
                    onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., React, Node.js"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min DSA Rating
                  </label>
                  <input
                    type="number"
                    value={form.dsaRatingMin}
                    onChange={(e) => setForm({ ...form, dsaRatingMin: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max DSA Rating
                  </label>
                  <input
                    type="number"
                    value={form.dsaRatingMax}
                    onChange={(e) => setForm({ ...form, dsaRatingMax: e.target.value })}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105"
              >
                Create Group
              </button>
            </form>
          </div>
        )}

        {groups.length === 0 ? (
          <div className="bg-white p-8 sm:p-12 rounded-2xl card-shadow border border-pink-100 text-center">
            <p className="text-gray-600 text-base sm:text-lg">No groups found. Create the first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {groups.map((group) => (
              <GroupCard key={group._id} group={{ ...group, currentUserId: user?._id }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

