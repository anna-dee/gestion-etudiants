from collections import Counter
from datetime import date

from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Etudiant
from .serializers import EtudiantSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"detail": "Identifiants incorrects."}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "username": user.username})


@api_view(["POST"])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response(status=204)


@api_view(["GET"])
def me(request):
    return Response({"username": request.user.username})


class EtudiantViewSet(viewsets.ModelViewSet):
    serializer_class = EtudiantSerializer

    def get_queryset(self):
        qs = Etudiant.objects.all()
        q = self.request.query_params.get("search", "").strip()
        if q:
            qs = qs.filter(
                Q(matricule__icontains=q)
                | Q(nom__icontains=q)
                | Q(prenom__icontains=q)
                | Q(email__icontains=q)
                | Q(telephone__icontains=q)
            )
        return qs

    def list(self, request, *args, **kwargs):
        # ?all=1 : liste complète non paginée (utilisée pour l'export PDF)
        if request.query_params.get("all") == "1":
            data = self.get_serializer(self.filter_queryset(self.get_queryset()), many=True).data
            return Response(data)
        return super().list(request, *args, **kwargs)


TRANCHES = [("< 18 ans", 0, 17), ("18-20 ans", 18, 20), ("21-25 ans", 21, 25), ("26-30 ans", 26, 30), ("> 30 ans", 31, 200)]


@api_view(["GET"])
def dashboard_stats(request):
    etudiants = list(Etudiant.objects.all())
    total = len(etudiants)
    ages = [e.age for e in etudiants]

    par_tranche = [
        {"label": label, "value": sum(1 for a in ages if lo <= a <= hi)}
        for label, lo, hi in TRANCHES
    ]

    par_annee = Counter(e.date_naissance.year for e in etudiants)
    par_annee = [{"label": str(y), "value": c} for y, c in sorted(par_annee.items())]

    avec_email = sum(1 for e in etudiants if e.email)
    avec_tel = sum(1 for e in etudiants if e.telephone)

    return Response(
        {
            "total": total,
            "age_moyen": round(sum(ages) / total, 1) if total else 0,
            "age_min": min(ages) if total else 0,
            "age_max": max(ages) if total else 0,
            "avec_email": avec_email,
            "sans_email": total - avec_email,
            "avec_telephone": avec_tel,
            "sans_telephone": total - avec_tel,
            "par_tranche_age": par_tranche,
            "par_annee_naissance": par_annee,
            "genere_le": date.today().isoformat(),
        }
    )
