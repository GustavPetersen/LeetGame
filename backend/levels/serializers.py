from rest_framework import serializers
from .models import Level, LevelTestCase


class LevelTestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelTestCase
        fields = ["id", "input_data", "expected_output", "order"]


class LevelSerializer(serializers.ModelSerializer):
    sample_test_cases = serializers.SerializerMethodField()

    class Meta:
        model = Level
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "difficulty",
            "order",
            "chapter",
            "chapter_order",
            "node_type",
            "starter_code_python",
            "function_name",
            "sample_test_cases",
        ]

    def get_sample_test_cases(self, obj):
        visible_tests = obj.test_cases.filter(is_hidden=False).order_by("order")
        return LevelTestCaseSerializer(visible_tests, many=True).data