import { useState } from "react";

const EMPTY = { matricule: "", nom: "", prenom: "", date_naissance: "", email: "", telephone: "" };

export default function EtudiantForm({ initial, onSave, onCancel }) {
  const editing = !!initial;
  const [form, setForm] = useState(initial ? { ...EMPTY, ...initial } : EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <form className="modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <h2>{editing ? "Modifier l'étudiant" : "Nouvel étudiant"}</h2>
        {error && <div className="alert">{error}</div>}

        <label>
          Matricule *
          <input value={form.matricule} onChange={set("matricule")} maxLength={20} required disabled={editing} />
        </label>
        <div className="row">
          <label>
            Nom *
            <input value={form.nom} onChange={set("nom")} maxLength={100} required />
          </label>
          <label>
            Prénom *
            <input value={form.prenom} onChange={set("prenom")} maxLength={100} required />
          </label>
        </div>
        <label>
          Date de naissance *
          <input type="date" value={form.date_naissance} onChange={set("date_naissance")} required />
        </label>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={set("email")} maxLength={150} />
        </label>
        <label>
          Téléphone
          <input value={form.telephone} onChange={set("telephone")} maxLength={20} />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onCancel}>Annuler</button>
          <button className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
        </div>
      </form>
    </div>
  );
}
