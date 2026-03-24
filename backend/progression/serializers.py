from rest_framework import serializers
from .models import PlayerProgress, LevelCompletion

class PlayerProgressSerializer(serializers.ModelSerializer):
    highest_unlocked_level_order = serializers.SerializerMethodField()
    highest_unlocked_level_title = serializers.SerializerMethodField()

    class Meta:
        model = PlayerProgress
        fields = [
            "id",
            "user",
            "highest_unlocked_level",
            "highest_unlocked_level_order",
            "highest_unlocked_level_title",
            "completed_levels_count",
        ]

    def get_highest_unlocked_level_order(self, obj):
        if obj.highest_unlocked_level is None:
            return None
        return obj.highest_unlocked_level.order

    def get_highest_unlocked_level_title(self, obj):
        if obj.highest_unlocked_level is None:
            return None
        return obj.highest_unlocked_level.title


class LevelCompletionSerializer(serializers.ModelSerializer):
    level_title = serializers.SerializerMethodField()
    level_slug = serializers.SerializerMethodField()
    level_order = serializers.SerializerMethodField()

    class Meta:
        model = LevelCompletion
        fields = [
            "id",
            "user",
            "level",
            "level_title",
            "level_slug",
            "level_order",
            "completed_at",
        ]

    def get_level_title(self, obj):
        return obj.level.title

    def get_level_slug(self, obj):
        return obj.level.slug

    def get_level_order(self, obj):
        return obj.level.order