from rest_framework import serializers


class ProfileStatsSerializer(serializers.Serializer):
    username = serializers.CharField()
    completed_levels_count = serializers.IntegerField()
    total_submissions = serializers.IntegerField()
    accepted_submissions = serializers.IntegerField()
    acceptance_rate = serializers.FloatField()
    highest_unlocked_level_order = serializers.IntegerField(allow_null=True)
    highest_unlocked_level_title = serializers.CharField(allow_null=True)