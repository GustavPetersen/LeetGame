from rest_framework import generics
from .models import PlayerProgress, LevelCompletion
from .serializers import PlayerProgressSerializer, LevelCompletionSerializer

# Create your views here.
class PlayerProgressListView(generics.ListAPIView):
    queryset = PlayerProgress.objects.all()
    serializer_class = PlayerProgressSerializer


class PlayerProgressDetailView(generics.RetrieveAPIView):
    queryset = PlayerProgress.objects.all()
    serializer_class = PlayerProgressSerializer
    lookup_field = "user_id"

class LevelCompletionListView(generics.ListAPIView):
    serializer_class = LevelCompletionSerializer

    def get_queryset(self): # type: ignore
        user_id = self.kwargs["user_id"]
        return LevelCompletion.objects.filter(user_id=user_id).order_by("level__order")