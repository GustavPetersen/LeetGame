from rest_framework import serializers
from .models import Level

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "difficulty",
            "order",
            "starter_code_python",
            "function_name",
        ]