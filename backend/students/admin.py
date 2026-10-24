from django.contrib import admin

from .models import Etudiant


@admin.register(Etudiant)
class EtudiantAdmin(admin.ModelAdmin):
    list_display = ("matricule", "nom", "prenom", "date_naissance", "email", "telephone")
    search_fields = ("matricule", "nom", "prenom", "email")
