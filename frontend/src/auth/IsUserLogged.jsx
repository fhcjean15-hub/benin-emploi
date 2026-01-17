// src/auth/RequireAuth.jsx
import { Navigate } from "react-router-dom";

export default function IsUserLogged({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard/home" replace/>;
  }

  return children;
}
