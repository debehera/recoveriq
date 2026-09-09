import { Navigate } from "react-router-dom";
import { getSession } from "./auth";

export default function ProtectedRoute({ children, allowedRole }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && session.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}