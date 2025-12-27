import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/dashboard" 
            className="font-bold text-xl sm:text-2xl text-gradient"
            onClick={() => setMobileMenuOpen(false)}
          >
            PeerUp
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/search"
              className="text-sm font-medium text-purple-700 hover:text-pink-600 transition-colors"
            >
              Find Matches
            </Link>
            <Link
              to="/groups"
              className="text-sm font-medium text-purple-700 hover:text-pink-600 transition-colors"
            >
              Groups
            </Link>
            
            {user && (
              <>
                {!user.isProfileComplete && (
                  <Link
                    to="/onboarding"
                    className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    Complete Profile
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-pink-200"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-purple-700 hover:bg-pink-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-pink-100 pt-4 space-y-3">
            <Link
              to="/search"
              className="block py-2 text-base font-medium text-purple-700 hover:text-pink-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Matches
            </Link>
            <Link
              to="/groups"
              className="block py-2 text-base font-medium text-purple-700 hover:text-pink-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Groups
            </Link>
            
            {user && (
              <>
                {!user.isProfileComplete && (
                  <Link
                    to="/onboarding"
                    className="block py-2 text-base font-medium text-pink-600 hover:text-pink-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Complete Profile
                  </Link>
                )}
                <div className="flex items-center gap-3 py-2 border-t border-pink-100 pt-3">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-pink-200"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-base font-medium text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
