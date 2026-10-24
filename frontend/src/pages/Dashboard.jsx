import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../api.js";

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/dashboard/").then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="alert">{error}</div>;
  if (!stats) return <p className="muted">Chargement…</p>;

  const contacts = [
    { name: "Avec e-mail", value: stats.avec_email },
    { name: "Sans e-mail", value: stats.sans_email },
  ];
  const phones = [
    { name: "Avec téléphone", value: stats.avec_telephone },
    { name: "Sans téléphone", value: stats.sans_telephone },
  ];

  return (
    <>
      <header className="page-head">
        <h1>Dashboard</h1>
        <p className="muted">Résultats calculés automatiquement à partir des étudiants enregistrés.</p>
      </header>

      <section className="stats">
        <Stat label="Étudiants" value={stats.total} />
        <Stat label="Âge moyen" value={`${stats.age_moyen} ans`} />
        <Stat label="Plus jeune" value={`${stats.age_min} ans`} />
        <Stat label="Plus âgé" value={`${stats.age_max} ans`} />
      </section>

      {stats.total === 0 ? (
        <div className="card">Aucun étudiant enregistré pour le moment.</div>
      ) : (
        <section className="charts">
          <div className="card">
            <h3>Répartition par tranche d'âge</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.par_tranche_age}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Étudiants" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Étudiants par année de naissance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.par_annee_naissance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" name="Étudiants" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Adresses e-mail renseignées</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={contacts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {contacts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i * 2]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3>Téléphones renseignés</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={phones} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {phones.map((_, i) => (
                    <Cell key={i} fill={COLORS[i * 2 + 1] || COLORS[1]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </>
  );
}
