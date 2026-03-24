from django.urls import path
from .views import LevelListView, LevelDetailView

urlpatterns = [
    path("", LevelListView.as_view(), name="level-list"),
    path("<slug:slug>/", LevelDetailView.as_view(), name="level-detail"),
]