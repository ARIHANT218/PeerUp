import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import InsightCard from "../components/InsightCard";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalMatches: 0 });
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchInsight();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsight = async () => {
    try {
      const res = await api.get("/insight");
      setInsight(res.data);
    } catch (error) {
      console.error("Failed to fetch insight:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="gradient-primary text-white py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-white opacity-5 rounded-full -ml-24 sm:-ml-48 -mb-24 sm:-mb-48"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold">
              🎯 Skill-Based Matching Platform
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Find Your Study Match
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 text-pink-100 max-w-3xl mx-auto leading-relaxed px-4">
            Connect with peers who share your DSA level, technical skills, and tech stack
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link
              to="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-700 rounded-full font-semibold shadow-xl hover:bg-pink-50 transform transition-all duration-200 hover:scale-105 text-base sm:text-lg"
            >
              Find Matches
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/groups"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full font-semibold border-2 border-white border-opacity-30 hover:bg-opacity-30 transform transition-all duration-200 hover:scale-105 text-base sm:text-lg"
            >
              Explore Groups
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.101M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.101M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* INSIGHT CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 -mt-6 sm:-mt-10">
        <InsightCard insight={insight} />
      </section>

      {/* STATS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-2">Platform Statistics</h2>
          <p className="text-sm sm:text-base text-gray-600">Join thousands of students collaborating together</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl card-shadow border border-pink-100 text-center p-8 relative overflow-hidden group hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-5xl font-bold text-gradient mb-3">
              {loading ? "..." : stats.totalUsers}
            </div>
            <p className="text-gray-600 text-sm font-semibold">Active Users</p>
            <div className="mt-4 w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-pink-100 text-center p-8 relative overflow-hidden group hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.101M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.101M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-5xl font-bold text-gradient mb-3">
              {loading ? "..." : stats.totalMatches}
            </div>
            <p className="text-gray-600 text-sm font-semibold">Total Matches</p>
            <div className="mt-4 w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="bg-white rounded-2xl card-shadow border border-pink-100 text-center p-8 relative overflow-hidden group hover:card-shadow-hover transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-5xl font-bold text-gradient mb-3">
              {loading ? "..." : stats.activeUsers}
            </div>
            <p className="text-gray-600 text-sm font-semibold">Profiles Complete</p>
            <div className="mt-4 w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* LONG SCROLLABLE CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-12">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl card-shadow border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.101M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.101M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">
                Why Collaborate with Peers?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                Learning together significantly improves consistency, motivation, and outcomes. 
                When you work with students who share similar academic preferences and skill levels, 
                you create an environment that fosters growth and accountability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  "Stay motivated with peer accountability",
                  "Learn different problem-solving approaches",
                  "Build a network of like-minded developers",
                  "Accelerate your learning curve"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                    <svg className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-2xl card-shadow border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">
                How Our Matching Works
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                Our explainable matching algorithm considers three key factors to find your perfect study partner:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                  <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xl mb-4">
                    5
                  </div>
                  <h3 className="font-bold text-purple-700 mb-2 text-lg">Skill Overlap</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Highest weight (5 points per matching skill). We prioritize students with overlapping technical skills.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-purple-700 mb-2 text-lg">Tech Stack Match</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    3 points for matching tech stack. Work with peers using the same technologies.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl mb-4">
                    ~
                  </div>
                  <h3 className="font-bold text-purple-700 mb-2 text-lg">DSA Rating Proximity</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Penalty-based scoring ensures you match with students at a similar DSA level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-2xl card-shadow border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 gradient-primary"></div>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 mb-4">
                Getting Started
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                Ready to find your perfect study match? Follow these simple steps:
              </p>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Complete your profile", desc: "Add your DSA rating, technical skills, and preferred tech stack" },
                  { step: "2", title: "Set your preferences", desc: "Use our search filters to specify what you're looking for (all fields are optional)" },
                  { step: "3", title: "Find matches", desc: "Browse through students ranked by compatibility score" },
                  { step: "4", title: "Start collaborating", desc: "Connect and begin your learning journey together" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-pink-100">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-700 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 sm:p-8 md:p-12 rounded-2xl text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-white opacity-5 rounded-full -ml-24 sm:-ml-48 -mb-24 sm:-mb-48"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Match?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-pink-100 max-w-2xl mx-auto px-4">
              Start searching for students who share your academic preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-full font-semibold shadow-xl hover:bg-pink-50 transform transition-all duration-200 hover:scale-105 text-lg"
              >
                Explore Matches
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/groups"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full font-semibold border-2 border-white border-opacity-30 hover:bg-opacity-30 transform transition-all duration-200 hover:scale-105 text-lg"
              >
                Join Groups
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.101M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.101M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


