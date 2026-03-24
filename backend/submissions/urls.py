from django.urls import path
from .views import SubmissionListView, SubmissionDetailView, SubmissionCreateView

urlpatterns = [
    path("", SubmissionListView.as_view(), name="submission-list"),
    path("create/", SubmissionCreateView.as_view(), name="submission-create"),
    path("<int:pk>/", SubmissionDetailView.as_view(), name="submission-detail"),
]