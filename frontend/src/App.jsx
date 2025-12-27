import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Onboarding from "./pages/Onboarding";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import Chat from "./pages/Chat";

const isAuth = () => !!localStorage.getItem("token");

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }
  
  if (!isAuth()) {
    return <Navigate to="/" />;
  }
  
  // Redirect to onboarding if profile is not complete
  if (user && !user.isProfileComplete) {
    return <Navigate to="/onboarding" />;
  }
  
  return children;
};

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }
  
  if (!isAuth()) {
    return <Navigate to="/" />;
  }
  
  if (user?.isProfileComplete) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
      />
      <Route
        path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <Onboarding />
            </OnboardingRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:id"
          element={
            <PrivateRoute>
              <GroupDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
