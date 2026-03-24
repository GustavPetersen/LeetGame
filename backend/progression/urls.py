from django.urls import path
from .views import PlayerProgressListView, PlayerProgressDetailView, LevelCompletionListView

urlpatterns = [
    path("", PlayerProgressListView.as_view(), name="progression-list"),
    path("<int:user_id>/", PlayerProgressDetailView.as_view(), name="progression-detail"),
    path("<int:user_id>/completions/", LevelCompletionListView.as_view(), name="completion-list"),
]