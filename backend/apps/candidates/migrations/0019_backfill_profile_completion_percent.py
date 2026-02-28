from django.db import migrations


def backfill_profile_completion(apps, schema_editor):
    CandidateProfile = apps.get_model("candidates", "CandidateProfile")
    qs = CandidateProfile.objects.prefetch_related(
        "skills",
        "employments",
        "educations",
        "projects",
    ).all()

    updates = []
    for profile in qs.iterator():
        total = 0
        # mirror utils.profile_completion weights
        if profile.full_name:
            total += 5
        if profile.email:
            total += 5
        if profile.phone:
            total += 5
        if profile.location:
            total += 5
        if profile.work_status:
            total += 5
        if profile.availability_to_join:
            total += 5
        if profile.summary:
            total += 15
        if list(profile.skills.all()):
            total += 15
        if list(profile.employments.all()):
            total += 15
        if list(profile.educations.all()):
            total += 15
        if list(profile.projects.all()):
            total += 5
        if profile.resume_file:
            total += 10

        profile.profile_completion_percent = min(total, 100)
        updates.append(profile)

    if updates:
        CandidateProfile.objects.bulk_update(updates, ["profile_completion_percent"])


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0018_candidateprofile_completion_percent"),
    ]

    operations = [
        migrations.RunPython(backfill_profile_completion, migrations.RunPython.noop),
    ]
