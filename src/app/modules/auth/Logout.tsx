import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./core/Auth";

export function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Navigate to="/auth/login" replace />;
}
