import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dsaRating: "",
    skills: "",
    techStack: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        if (res.data.dsaRating) setForm(prev => ({ ...prev, dsaRating: res.data.dsaRating }));
        if (res.data.skills?.length) setForm(prev => ({ ...prev, skills: res.data.skills.join(", ") }));
        if (res.data.techStack) setForm(prev => ({ ...prev, techStack: res.data.techStack }));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        dsaRating: form.dsaRating ? Number(form.dsaRating) : undefined,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()).filter(s => s) : [],
        techStack: form.techStack || undefined
      };

      await api.put("/user/profile", profileData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl card-shadow border border-pink-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Help us find the perfect study matches for you by sharing your academic preferences.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DSA Rating <span className="text-pink-600">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="e.g., 1200"
                value={form.dsaRating}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setForm({ ...form, dsaRating: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Your current DSA proficiency level (e.g., LeetCode rating)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Skills <span className="text-pink-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., React, Node.js, MongoDB, Python"
                value={form.skills}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setForm({ ...form, skills: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack <span className="text-pink-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., MERN, MEAN, Python, Java"
                value={form.techStack}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                onChange={(e) =>
                  setForm({ ...form, techStack: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Your preferred technology stack
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
