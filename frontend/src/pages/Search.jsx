import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import MatchCard from "../components/MatchCard";

export default function Search() {
  const [form, setForm] = useState({
    dsaRating: "",
    skills: "",
    techStack: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchMatches = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const searchData = {};
      if (form.dsaRating) searchData.dsaRating = Number(form.dsaRating);
      if (form.skills) {
        searchData.skills = form.skills.split(",").map(s => s.trim()).filter(s => s);
      }
      if (form.techStack) searchData.techStack = form.techStack.trim();

      const res = await api.post("/match/search", searchData);
      setResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-700 mb-4 sm:mb-8 text-center px-4">
          Find Your Perfect Match
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-8 sm:mb-12 px-4">
          All search fields are optional. Leave empty to see all available matches.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* SEARCH FILTERS */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-2xl card-shadow border border-pink-100 lg:sticky lg:top-24">
              <h3 className="font-bold text-xl text-purple-700 mb-6">
                Search Preferences
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DSA Rating
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1200"
                    value={form.dsaRating}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    onChange={(e) =>
                      setForm({ ...form, dsaRating: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={form.skills}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    onChange={(e) =>
                      setForm({ ...form, skills: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., MERN, MEAN, Python"
                    value={form.techStack}
                    className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    onChange={(e) =>
                      setForm({ ...form, techStack: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={searchMatches}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Searching..." : "Find Best Matches"}
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
              </div>
            ) : searched && results.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl card-shadow border border-pink-100 text-center">
                <p className="text-gray-600 text-lg">No matches found. Try adjusting your search criteria.</p>
              </div>
            ) : searched && results.length > 0 ? (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Found {results.length} {results.length === 1 ? "match" : "matches"}
                </p>
                <div className="space-y-4">
                  {results.map((r) => (
                    <MatchCard key={r.user._id} data={r} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl card-shadow border border-pink-100 text-center">
                <p className="text-gray-600 text-lg">
                  Enter your preferences and click "Find Best Matches" to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
