import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportEtudiantsPDF(etudiants, filtre = "") {
  const doc = new jsPDF({ orientation: "landscape" });
  const date = new Date().toLocaleDateString("fr-FR");

  doc.setFontSize(18);
  doc.text("Liste des étudiants", 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(`Édité le ${date}${filtre ? ` — filtre : « ${filtre} »` : ""}`, 14, 23);

  const ages = etudiants.map((e) => e.age);
  const moyenne = ages.length ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1) : "0";

  autoTable(doc, {
    startY: 28,
    head: [["Matricule", "Nom", "Prénom", "Naissance", "Âge", "E-mail", "Téléphone"]],
    body: etudiants.map((e) => [
      e.matricule,
      e.nom,
      e.prenom,
      new Date(e.date_naissance).toLocaleDateString("fr-FR"),
      `${e.age} ans`,
      e.email || "—",
      e.telephone || "—",
    ]),
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 9 },
    foot: [[`Total : ${etudiants.length} étudiant(s)`, "", "", "", `Moy. ${moyenne}`, "", ""]],
    footStyles: { fillColor: [238, 240, 255], textColor: 30 },
    didDrawPage: () => {
      const page = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Page ${page}`, doc.internal.pageSize.getWidth() - 25, doc.internal.pageSize.getHeight() - 8);
    },
  });

  doc.save(`etudiants_${new Date().toISOString().slice(0, 10)}.pdf`);
}
