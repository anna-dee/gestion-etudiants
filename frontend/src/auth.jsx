import { createContext, useContext, useState } from "react";
import { api, clearToken, getToken, setToken } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem("ge_user"));
  const isAuthenticated = !!getToken();

  async function login(user, password) {
    const data = await api("/auth/login/", {
      method: "POST",
      body: { username: user, password },
    });
    setToken(data.token);
    localStorage.setItem("ge_user", data.username);
    setUsername(data.username);
  }

  async function logout() {
    try {
      await api("/auth/logout/", { method: "POST" });
    } catch {
      /* ignore */
    }
    clearToken();
    localStorage.removeItem("ge_user");
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
