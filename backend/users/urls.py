from django.urls import path
from .views import RegisterView, MyProfileStatsView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/stats/", MyProfileStatsView.as_view(), name="my-profile-stats"),
]