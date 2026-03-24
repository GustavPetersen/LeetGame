from rest_framework import generics
from .models import PlayerProgress
from .serializers import PlayerProgressSerializer

# Create your views here.
class PlayerProgressListView(generics.ListAPIView):
    queryset = PlayerProgress.objects.all()
    serializer_class = PlayerProgressSerializer


class PlayerProgressDetailView(generics.RetrieveAPIView):
    queryset = PlayerProgress.objects.all()
    serializer_class = PlayerProgressSerializer
    lookup_field = "user_id"