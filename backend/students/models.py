from datetime import date

from django.db import models


class Etudiant(models.Model):
    matricule = models.CharField(max_length=20, primary_key=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    email = models.CharField(max_length=150, blank=True, default="")
    telephone = models.CharField(max_length=20, blank=True, default="")

    class Meta:
        db_table = "etudiants"
        ordering = ["nom", "prenom"]

    def __str__(self):
        return f"{self.matricule} - {self.nom} {self.prenom}"

    @property
    def age(self):
        today = date.today()
        d = self.date_naissance
        return today.year - d.year - ((today.month, today.day) < (d.month, d.day))
