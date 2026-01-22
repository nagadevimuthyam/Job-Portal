from django.db import migrations, models
import uuid
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("accounts", "0002_update_roles_fields"),
    ]

    operations = [
        migrations.CreateModel(
            name="CandidateProfile",
            fields=[
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("full_name", models.CharField(max_length=200)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(max_length=30, blank=True)),
                ("location", models.CharField(max_length=200, blank=True)),
                ("total_experience", models.DecimalField(max_digits=4, decimal_places=1, default=0)),
                ("skills", models.JSONField(default=list, blank=True)),
                ("skills_text", models.TextField(blank=True)),
                ("summary", models.TextField(blank=True)),
                ("notice_period_days", models.PositiveIntegerField(null=True, blank=True)),
                ("expected_salary", models.PositiveIntegerField(null=True, blank=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="candidate_profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-last_updated"]},
        ),
        migrations.CreateModel(
            name="CandidateResume",
            fields=[
                ("id", models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ("file", models.FileField(upload_to="resumes/")),
                ("parsed_text", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "candidate",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="resumes",
                        to="candidates.candidateprofile",
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
    ]
