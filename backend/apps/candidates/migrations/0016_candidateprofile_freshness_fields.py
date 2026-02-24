from django.db import migrations, models
from django.utils import timezone


def backfill_freshness(apps, schema_editor):
    CandidateProfile = apps.get_model("candidates", "CandidateProfile")
    for profile in CandidateProfile.objects.all():
        if not profile.profile_updated_at:
            profile.profile_updated_at = profile.updated_at or timezone.now()
        if profile.last_active_at:
            profile.freshness_at = max(profile.last_active_at, profile.profile_updated_at)
        else:
            profile.freshness_at = profile.profile_updated_at
        profile.save(update_fields=["profile_updated_at", "freshness_at"])


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0015_rename_candidates__skill_norm_idx_candidates__normali_b1977c_idx"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="last_active_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="profile_updated_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="freshness_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddIndex(
            model_name="candidateprofile",
            index=models.Index(fields=["created_at"], name="candidates__created_at_idx"),
        ),
        migrations.AddIndex(
            model_name="candidateprofile",
            index=models.Index(fields=["last_active_at"], name="candidates__last_active_idx"),
        ),
        migrations.AddIndex(
            model_name="candidateprofile",
            index=models.Index(fields=["profile_updated_at"], name="candidates__profile_upd_idx"),
        ),
        migrations.AddIndex(
            model_name="candidateprofile",
            index=models.Index(fields=["freshness_at"], name="candidates__freshness_idx"),
        ),
        migrations.RunPython(backfill_freshness, migrations.RunPython.noop),
    ]
