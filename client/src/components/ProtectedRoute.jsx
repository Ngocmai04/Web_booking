import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading login information...
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;