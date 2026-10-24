from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("etudiants", views.EtudiantViewSet, basename="etudiant")

urlpatterns = [
    path("auth/login/", views.login),
    path("auth/logout/", views.logout),
    path("auth/me/", views.me),
    path("dashboard/", views.dashboard_stats),
    path("", include(router.urls)),
]
