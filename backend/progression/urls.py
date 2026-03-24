from django.urls import path
from .views import PlayerProgressListView, PlayerProgressDetailView

urlpatterns = [
    path("", PlayerProgressListView.as_view(), name="progression-list"),
    path("<int:user_id>/", PlayerProgressDetailView.as_view(), name="progression-detail"),
]