from django.contrib import admin
from .models import Level, LevelTestCase

# Register your models here.
class LevelTestCaseInline(admin.TabularInline):
    model = LevelTestCase
    extra = 1

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("order", "title", "difficulty")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LevelTestCaseInline]


@admin.register(LevelTestCase)
class LevelTestCaseAdmin(admin.ModelAdmin):
    list_display = ("level", "order", "is_hidden")