import { Link, NavLink, useNavigate } from "react-router-dom";
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

      
        <Link
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
          className="text-2xl font-extrabold tracking-tight text-purple-600"
        >
          Peer<span className="text-pink-500">Up</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

       
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1 rounded-md transition ${
                isActive
                  ? "text-pink-600 border-b-2 border-pink-500"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
          >
            Find Matches
          </NavLink>

          <NavLink
            to="/groups"
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-1 rounded-md transition ${
                isActive
                  ? "text-pink-600 border-b-2 border-pink-500"
                  : "text-gray-700 hover:text-pink-600 hover:bg-pink-50"
              }`
            }
          >
            Groups
          </NavLink>

          {/* User Dropdown */}
          {user && (
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer">
                <img
                  src={user.avatar || "/avatar.png"}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border-2 border-pink-200"
                />
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-3 hidden group-hover:block bg-white shadow-lg rounded-lg w-44 border">
                

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-pink-50"
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
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">

          <NavLink
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-700 hover:text-pink-600"
          >
            Find Matches
          </NavLink>

          <NavLink
            to="/groups"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-700 hover:text-pink-600"
          >
            Groups
          </NavLink>

          {user && (
            <>
              <div className="flex items-center gap-3 pt-4 border-t">
                <img
                  src={user.avatar || "/avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-pink-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
