from rest_framework import serializers
from .models import PlayerProgress

class PlayerProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerProgress
        fields = [
            "id"
            "user",
            "highest_unlocked_level",
            "completed_levels_count"
        ]