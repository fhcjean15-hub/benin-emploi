// src/auth/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Pas connecté
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Connecté mais pas admin
  if (user.role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return children;
}
