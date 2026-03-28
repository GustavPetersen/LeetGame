from django.urls import path
from .views import SubmissionListView, SubmissionDetailView, SubmissionCreateView, RunCodeView

urlpatterns = [
    path("", SubmissionListView.as_view(), name="submission-list"),
    path("create/", SubmissionCreateView.as_view(), name="submission-create"),
    path("run/", RunCodeView.as_view(), name="run-code"),
    path("<int:pk>/", SubmissionDetailView.as_view(), name="submission-detail"),
]