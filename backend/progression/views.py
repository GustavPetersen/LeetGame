from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PlayerProgress, LevelCompletion
from .serializers import PlayerProgressSerializer, LevelCompletionSerializer


class MyPlayerProgressView(generics.RetrieveAPIView):
    serializer_class = PlayerProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        progress, _ = PlayerProgress.objects.get_or_create(user=self.request.user)
        return progress


class MyLevelCompletionListView(generics.ListAPIView):
    serializer_class = LevelCompletionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LevelCompletion.objects.filter(user=self.request.user).order_by("level__order")