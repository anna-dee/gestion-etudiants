import random
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from students.models import Etudiant

NOMS = ["Rakoto", "Randria", "Rasoa", "Rabe", "Andria", "Ravelo", "Razafy", "Rahaingo", "Ramanana", "Rakotomalala"]
PRENOMS = ["Aina", "Hery", "Miora", "Tahiry", "Fanja", "Mamy", "Lalaina", "Toky", "Voahangy", "Niry"]


class Command(BaseCommand):
    help = "Crée un compte admin (admin / admin123) et des étudiants de démonstration."

    def handle(self, *args, **options):
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser("admin", "admin@example.com", "admin123")
            self.stdout.write("Compte créé : admin / admin123")

        if Etudiant.objects.exists():
            self.stdout.write("Des étudiants existent déjà : aucune donnée de démo ajoutée.")
            return

        random.seed(42)
        today = date.today()
        for i in range(1, 38):
            age = random.randint(17, 32)
            naissance = today - timedelta(days=age * 365 + random.randint(0, 364))
            nom = random.choice(NOMS)
            prenom = random.choice(PRENOMS)
            Etudiant.objects.create(
                matricule=f"ETU{i:04d}",
                nom=nom,
                prenom=prenom,
                date_naissance=naissance,
                email=f"{prenom.lower()}.{nom.lower()}{i}@mail.mg" if random.random() > 0.2 else "",
                telephone=f"034 {random.randint(10, 99)} {random.randint(100, 999)} {random.randint(10, 99)}"
                if random.random() > 0.15
                else "",
            )
        self.stdout.write(self.style.SUCCESS("37 étudiants de démonstration ajoutés."))
