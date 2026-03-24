from rest_framework import generics, status
from rest_framework.response import Response

from .models import Submission
from .serializers import SubmissionSerializer
from levels.models import Level
from progression.models import PlayerProgress, LevelCompletion

# Create your views here.
class SubmissionListView(generics.ListAPIView):
    queryset = Submission.objects.all().order_by("-submitted_at")
    serializer_class = SubmissionSerializer


class SubmissionDetailView(generics.RetrieveAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer


class SubmissionCreateView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data.get("code", "")
        user = serializer.validated_data["user"]
        level = serializer.validated_data["level"]

        fake_verdict = (
            Submission.Verdict.ACCEPTED
            if "return" in code and "pass" not in code
            else Submission.Verdict.WRONG_ANSWER
        )

        submission = serializer.save(verdict=fake_verdict)

        unlocked_next_level = None

        if submission.verdict == Submission.Verdict.ACCEPTED:
            LevelCompletion.objects.get_or_create(
                user=user,
                level=level,
            )

            progress, _ = PlayerProgress.objects.get_or_create(user=user)

            progress.completed_levels_count = LevelCompletion.objects.filter(user=user).count()

            next_level = Level.objects.filter(order=level.order + 1).first()

            if next_level:
                if (
                    progress.highest_unlocked_level is None
                    or next_level.order > progress.highest_unlocked_level.order
                ):
                    progress.highest_unlocked_level = next_level
                    unlocked_next_level = next_level.slug
            else:
                if (
                    progress.highest_unlocked_level is None
                    or level.order > progress.highest_unlocked_level.order
                ):
                    progress.highest_unlocked_level = level

            progress.save()

        response_data = SubmissionSerializer(submission).data
        response_data["unlocked_next_level"] = unlocked_next_level

        return Response(response_data, status=status.HTTP_201_CREATED)