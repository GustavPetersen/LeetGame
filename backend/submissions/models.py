from django.conf import settings
from django.db import models

# Create your models here.
class Submission(models.Model):
    class Language(models.TextChoices):
        PYTHON = "python", "Python"

    class Verdict(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        WRONG_ANSWER = "wrong_answer", "Wrong Answer"
        RUNTIME_ERROR = "runtime_error", "Runtime Error"
        COMPILATION_ERROR = "compilation_error", "Compilation Error"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    level = models.ForeignKey(
        "levels.Level",
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    language = models.CharField(max_length=20, choices=Language.choices)
    code = models.TextField()

    verdict = models.CharField(
        max_length=30,
        choices=Verdict.choices,
        default=Verdict.PENDING,
    )

    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.user} - {self.level} - {self.verdict}"