from rest_framework import serializers


class RunCodeSerializer(serializers.Serializer):
    level = serializers.IntegerField()
    language = serializers.CharField()
    code = serializers.CharField()