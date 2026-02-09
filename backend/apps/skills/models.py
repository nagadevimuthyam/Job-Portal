from django.db import models


def normalize_skill_name(value: str) -> str:
    return " ".join(value.lower().split()).strip()


class Skill(models.Model):
    name = models.CharField(max_length=255)
    normalized_name = models.CharField(max_length=255, unique=True, db_index=True)
    alt_labels = models.TextField(blank=True, default="")
    source_uri = models.TextField(blank=True, default="")
    popularity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["normalized_name"])]

    def save(self, *args, **kwargs):
        if self.name and not self.normalized_name:
            self.normalized_name = normalize_skill_name(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name
