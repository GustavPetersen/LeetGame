from rest_framework import generics
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