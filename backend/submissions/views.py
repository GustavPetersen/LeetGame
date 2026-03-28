from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Submission
from .serializers import SubmissionSerializer
from .judge import judge_python_submission
from .run_serializers import RunCodeSerializer
from levels.models import Level
from progression.models import PlayerProgress, LevelCompletion


class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Submission.objects.filter(user=self.request.user).order_by("-id")
        level_id = self.request.query_params.get("level")

        if level_id:
            queryset = queryset.filter(level_id=level_id)

        return queryset


class SubmissionDetailView(generics.RetrieveAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(user=self.request.user)


class SubmissionCreateView(generics.CreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
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
        submission = serializer.save(user=user, verdict=verdict)

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


class RunCodeView(generics.GenericAPIView):
    serializer_class = RunCodeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        level_id = serializer.validated_data["level"]
        language = serializer.validated_data["language"]
        code = serializer.validated_data["code"]

        if language != "python":
            return Response(
                {"detail": "Only Python is supported right now."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            level = Level.objects.get(id=level_id)
        except Level.DoesNotExist:
            return Response({"detail": "Level not found."}, status=status.HTTP_404_NOT_FOUND)

        sample_test_cases = level.test_cases.filter(is_hidden=False).order_by("order")
        judge_result = judge_python_submission(
            code=code,
            function_name=level.function_name,
            test_cases=sample_test_cases,
        )

        return Response(
            {
                "verdict": judge_result["verdict"],
                "judge_result": judge_result,
                "total_sample_tests": sample_test_cases.count(),
            },
            status=status.HTTP_200_OK,
        )