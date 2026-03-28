from django.db import models


class Level(models.Model):
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    class NodeType(models.TextChoices):
        NORMAL = "normal", "Normal"
        BOSS = "boss", "Boss"

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices)
    order = models.PositiveIntegerField(unique=True)

    chapter = models.CharField(max_length=100, default="Chapter 1")
    chapter_order = models.PositiveIntegerField(default=1)
    node_type = models.CharField(
        max_length=20,
        choices=NodeType.choices,
        default=NodeType.NORMAL,
    )

    starter_code_python = models.TextField(blank=True)
    function_name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["chapter_order", "order"]

    def __str__(self):
        return f"{self.order}. {self.title}"
    
class LevelTestCase(models.Model):
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="test_cases",
    )
    input_data = models.JSONField()
    expected_output = models.JSONField()
    is_hidden = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.level.title} - Test {self.order}"