import { getAccessToken } from "@/lib/services/auth.service";
import { Navigate, Outlet } from "react-router-dom";


export function RequireToken() {
  const token = getAccessToken();

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}
