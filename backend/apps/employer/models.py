import uuid

from django.conf import settings
from django.db import models


class EmployerSearchPreset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="search_presets",
    )
    title = models.CharField(max_length=160, blank=True, default="")
    filters = models.JSONField(default=dict)
    filters_hash = models.CharField(max_length=64)
    is_saved = models.BooleanField(default=False)
    run_count = models.PositiveIntegerField(default=1)
    last_run_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-last_run_at", "-created_at")
        constraints = [
            models.UniqueConstraint(
                fields=("employer", "filters_hash"),
                name="employer_filters_hash_unique",
            )
        ]
        indexes = [
            models.Index(fields=("employer", "is_saved", "-last_run_at"), name="emp_saved_last_run_idx"),
        ]

    def __str__(self):
        return f"{self.employer_id}:{self.filters_hash}:{'saved' if self.is_saved else 'recent'}"
