from rest_framework import generics
from .models import Level
from .serializers import LevelSerializer

# Create your views here.
class LevelListView(generics.ListAPIView):
    queryset = Level.objects.all().order_by("order")
    serializer_class = LevelSerializer


class LevelDetailView(generics.RetrieveAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    lookup_field = "slug"