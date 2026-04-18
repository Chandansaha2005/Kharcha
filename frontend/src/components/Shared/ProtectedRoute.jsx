import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children, requireSetup = true }) {
  const location = useLocation();
  const { token, setupComplete } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireSetup && !setupComplete) {
    return <Navigate to="/setup" replace />;
  }

  return children;
}
