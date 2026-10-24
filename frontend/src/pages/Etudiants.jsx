import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import EtudiantForm from "../components/EtudiantForm.jsx";
import { exportEtudiantsPDF } from "../pdf.js";

const PAGE_SIZES = [5, 10, 20, 50];

export default function Etudiants() {
  const [data, setData] = useState({ count: 0, results: [] });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | "new" | étudiant

  const totalPages = Math.max(1, Math.ceil(data.count / pageSize));

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, page_size: pageSize });
      if (query) params.set("search", query);
      setData(await api(`/etudiants/?${params}`));
    } catch (e) {
      // page inexistante après une suppression : revenir à la page précédente
      if (page > 1 && /page/i.test(e.message)) setPage(page - 1);
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    load();
  }, [load]);

  // Recherche avec petit délai pour ne pas interroger le serveur à chaque touche
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(search.trim());
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function save(form) {
    const isEdit = modal !== "new";
    const body = {
      nom: form.nom,
      prenom: form.prenom,
      date_naissance: form.date_naissance,
      email: form.email,
      telephone: form.telephone,
    };
    if (isEdit) await api(`/etudiants/${modal.matricule}/`, { method: "PUT", body: { ...body, matricule: modal.matricule } });
    else await api("/etudiants/", { method: "POST", body: { ...body, matricule: form.matricule } });
    setModal(null);
    load();
  }

  async function remove(e) {
    if (!window.confirm(`Supprimer ${e.prenom} ${e.nom} (${e.matricule}) ?`)) return;
    try {
      await api(`/etudiants/${e.matricule}/`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function exportPDF() {
    try {
      const params = new URLSearchParams({ all: "1" });
      if (query) params.set("search", query);
      const all = await api(`/etudiants/?${params}`);
      exportEtudiantsPDF(all, query);
    } catch (err) {
      setError(err.message);
    }
  }

  const debut = data.count === 0 ? 0 : (page - 1) * pageSize + 1;
  const fin = Math.min(page * pageSize, data.count);

  // Numéros de pages affichés (fenêtre autour de la page courante)
  const pages = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(totalPages, page + 2); p++) pages.push(p);

  return (
    <>
      <header className="page-head row-between">
        <div>
          <h1>Étudiants</h1>
          <p className="muted">{data.count} étudiant(s) au total</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={exportPDF}>📄 Exporter en PDF</button>
          <button className="btn btn-primary" onClick={() => setModal("new")}>＋ Nouvel étudiant</button>
        </div>
      </header>

      <div className="card">
        <div className="toolbar">
          <input
            className="search"
            placeholder="Rechercher (matricule, nom, prénom, e-mail…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="inline">
            Par page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Naissance</th>
                <th>Âge</th>
                <th>E-mail</th>
                <th>Téléphone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && data.results.length === 0 ? (
                <tr><td colSpan={8} className="empty">Chargement…</td></tr>
              ) : data.results.length === 0 ? (
                <tr><td colSpan={8} className="empty">Aucun étudiant trouvé.</td></tr>
              ) : (
                data.results.map((e) => (
                  <tr key={e.matricule}>
                    <td><code>{e.matricule}</code></td>
                    <td>{e.nom}</td>
                    <td>{e.prenom}</td>
                    <td>{new Date(e.date_naissance).toLocaleDateString("fr-FR")}</td>
                    <td><span className="badge">{e.age} ans</span></td>
                    <td>{e.email || <span className="muted">—</span>}</td>
                    <td>{e.telephone || <span className="muted">—</span>}</td>
                    <td className="row-actions">
                      <button className="btn btn-sm" onClick={() => setModal(e)}>Modifier</button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(e)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="muted">
            {debut}–{fin} sur {data.count}
          </span>
          <div className="pager">
            <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
            {pages.map((p) => (
              <button key={p} className={"btn btn-sm" + (p === page ? " btn-primary" : "")} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
            <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
            <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        </div>
      </div>

      {modal && (
        <EtudiantForm initial={modal === "new" ? null : modal} onSave={save} onCancel={() => setModal(null)} />
      )}
    </>
  );
}
