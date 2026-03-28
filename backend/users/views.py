from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from progression.models import PlayerProgress, LevelCompletion
from submissions.models import Submission
from .serializers import RegisterSerializer
from .stats_serializers import ProfileStatsSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyProfileStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileStatsSerializer

    def get(self, request, *args, **kwargs):
        user = request.user

        progress, _ = PlayerProgress.objects.get_or_create(user=user)

        total_submissions = Submission.objects.filter(user=user).count()
        accepted_submissions = Submission.objects.filter(user=user, verdict="accepted").count()
        completed_levels_count = LevelCompletion.objects.filter(user=user).count()

        acceptance_rate = 0.0
        if total_submissions > 0:
            acceptance_rate = round((accepted_submissions / total_submissions) * 100, 1)

        data = {
            "username": user.username,
            "completed_levels_count": completed_levels_count,
            "total_submissions": total_submissions,
            "accepted_submissions": accepted_submissions,
            "acceptance_rate": acceptance_rate,
            "highest_unlocked_level_order": (
                progress.highest_unlocked_level.order
                if progress.highest_unlocked_level
                else None
            ),
            "highest_unlocked_level_title": (
                progress.highest_unlocked_level.title
                if progress.highest_unlocked_level
                else None
            ),
        }

        serializer = self.get_serializer(data)
        return Response(serializer.data)