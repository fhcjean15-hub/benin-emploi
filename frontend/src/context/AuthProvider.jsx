import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import api from "../api/axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    await api.post("/login", credentials);
    await fetchUser();
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isCandidate: user?.role === "candidat",
        login,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
