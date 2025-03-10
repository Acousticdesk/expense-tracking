import { Navigate, Outlet } from "react-router-dom";


export function RequireToken() {
  const token = localStorage.getItem("token");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
}
