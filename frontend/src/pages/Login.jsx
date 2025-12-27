import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setProcessing(true);
      localStorage.setItem("token", token);
      
      // Fetch user data and then redirect
      fetchUser().then(() => {
        // Clean up the URL
        window.history.replaceState({}, document.title, "/login");
        // Navigate will be handled by PrivateRoute based on profile completion
        navigate("/dashboard");
      }).catch(() => {
        setProcessing(false);
      });
    }
  }, [navigate, fetchUser]);

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/google`;
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary p-6">
        <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl text-center max-w-md w-full transform transition-all hover:scale-105">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
            StudentMatch
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Find peers with similar academic preferences
          </p>
        </div>
        
        <button
          onClick={loginWithGoogle}
          className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 text-sm sm:text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
        
        <p className="mt-6 text-xs text-gray-500">
          Secure authentication via Google OAuth
        </p>
      </div>
    </div>
  );
}
