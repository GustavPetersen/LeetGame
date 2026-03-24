from django.contrib import admin
from .models import PlayerProgress, LevelCompletion

# Register your models here.
admin.site.register(PlayerProgress)
admin.site.register(LevelCompletion)