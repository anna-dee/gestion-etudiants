import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Layout() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">🎓</span>
          <span>Gestion<br />des étudiants</span>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-icon">📊</span> Dashboard
          </NavLink>
          <NavLink to="/etudiants" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-icon">👥</span> Étudiants
          </NavLink>
        </nav>

        <div className="sidebar-foot">
          <div className="user">Connecté : <strong>{username}</strong></div>
          <button className="btn btn-ghost" onClick={handleLogout}>Déconnexion</button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
