import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="EmployerSearchPreset",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("title", models.CharField(blank=True, default="", max_length=160)),
                ("filters", models.JSONField(default=dict)),
                ("filters_hash", models.CharField(max_length=64)),
                ("is_saved", models.BooleanField(default=False)),
                ("run_count", models.PositiveIntegerField(default=1)),
                ("last_run_at", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "employer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="search_presets",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ("-last_run_at", "-created_at"),
            },
        ),
        migrations.AddConstraint(
            model_name="employersearchpreset",
            constraint=models.UniqueConstraint(
                fields=("employer", "filters_hash"),
                name="employer_filters_hash_unique",
            ),
        ),
        migrations.AddIndex(
            model_name="employersearchpreset",
            index=models.Index(
                fields=["employer", "is_saved", "-last_run_at"],
                name="emp_saved_last_run_idx",
            ),
        ),
    ]
