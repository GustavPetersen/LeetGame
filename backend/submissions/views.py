from rest_framework import generics, status
from rest_framework.response import Response

from .models import Submission
from .serializers import SubmissionSerializer
from .judge import judge_python_submission
from levels.models import Level
from progression.models import PlayerProgress, LevelCompletion


class SubmissionListView(generics.ListAPIView):
    queryset = Submission.objects.all().order_by("-id")
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

        user = serializer.validated_data["user"]
        level = serializer.validated_data["level"]
        language = serializer.validated_data["language"]
        code = serializer.validated_data["code"]

        if language != "python":
            return Response(
                {"detail": "Only Python is supported right now."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        test_cases = level.test_cases.all().order_by("order")
        judge_result = judge_python_submission(
            code=code,
            function_name=level.function_name,
            test_cases=test_cases,
        )

        verdict = judge_result["verdict"]

        submission = Submission.objects.create(
            user=user,
            level=level,
            language=language,
            code=code,
            verdict=verdict,
        )

        unlocked_next_level = None

        if verdict == "accepted":
            LevelCompletion.objects.get_or_create(user=user, level=level)

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
        response_data["judge_result"] = judge_result

        return Response(response_data, status=status.HTTP_201_CREATED)