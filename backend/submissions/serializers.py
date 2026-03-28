from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "id",
            "user",
            "level",
            "language",
            "code",
            "verdict",
            "submitted_at",
        ]
        read_only_fields = ["id", "user", "verdict", "submitted_at"]