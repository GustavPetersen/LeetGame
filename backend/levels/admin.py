from django.contrib import admin
from .models import Level, LevelTestCase


class LevelTestCaseInline(admin.TabularInline):
    model = LevelTestCase
    extra = 1


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("order", "title", "chapter", "chapter_order", "node_type", "difficulty", "is_active")
    list_filter = ("chapter", "chapter_order", "node_type", "difficulty", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LevelTestCaseInline]


@admin.register(LevelTestCase)
class LevelTestCaseAdmin(admin.ModelAdmin):
    list_display = ("level", "order", "is_hidden")