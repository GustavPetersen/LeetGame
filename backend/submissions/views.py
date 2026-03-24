from rest_framework import generics
from rest_framework.response import Response
from .models import Submission
from .serializers import SubmissionSerializer

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

        fake_verdict = "accepted" if "return" in code else "wrong_answer"

        submission = serializer.save(verdict=fake_verdict)

        response_serializer = self.get_serializer(submission)
        return Response(response_serializer.data, status=201)