from django.urls import path
from .views import MyPlayerProgressView, MyLevelCompletionListView

urlpatterns = [
    path("me/", MyPlayerProgressView.as_view(), name="my-progression"),
    path("me/completions/", MyLevelCompletionListView.as_view(), name="my-completions"),
]