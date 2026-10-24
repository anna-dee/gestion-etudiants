from rest_framework import serializers

from .models import Etudiant


class EtudiantSerializer(serializers.ModelSerializer):
    # Calcul automatique : l'âge est déduit de la date de naissance.
    age = serializers.IntegerField(read_only=True)

    class Meta:
        model = Etudiant
        fields = [
            "matricule",
            "nom",
            "prenom",
            "date_naissance",
            "email",
            "telephone",
            "age",
        ]
        extra_kwargs = {
            "email": {"required": False, "allow_blank": True},
            "telephone": {"required": False, "allow_blank": True},
        }
