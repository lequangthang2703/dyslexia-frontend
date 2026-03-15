import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProfileProtectedRoute = () => {
    const { hasSelectedProfile, loading } = useAuth();

    if (loading) {
        return (
      <div className="flex items-center justify-center h-full">
        <div className="loader animate-spin rounded-full border-8 border-pink-200 border-t-pink-500 h-16 w-16"></div>
      </div>
    );
    }
    return hasSelectedProfile ? <Outlet /> : <Navigate to="/profile/select" replace />;
};

export default ProfileProtectedRoute;