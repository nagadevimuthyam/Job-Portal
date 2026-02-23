from django.db import migrations, models


def backfill_skill_links(apps, schema_editor):
    CandidateSkill = apps.get_model("candidates", "CandidateSkill")
    Skill = apps.get_model("skills", "Skill")

    def normalize(value):
        return " ".join(value.lower().split()).strip()

    batch = []
    for skill in CandidateSkill.objects.all().iterator():
        normalized = normalize(skill.name or "")
        if not normalized:
            continue
        if skill.normalized_name != normalized:
            skill.normalized_name = normalized
        if skill.skill_id is None:
            skill_obj, _ = Skill.objects.get_or_create(
                normalized_name=normalized,
                defaults={"name": skill.name, "popularity": 0},
            )
            skill.skill_id = skill_obj.id
        batch.append(skill)
        if len(batch) >= 500:
            CandidateSkill.objects.bulk_update(batch, ["normalized_name", "skill_id"])
            batch = []
    if batch:
        CandidateSkill.objects.bulk_update(batch, ["normalized_name", "skill_id"])


class Migration(migrations.Migration):
    dependencies = [
        ("skills", "0001_initial"),
        ("candidates", "0012_candidateprofile_notice_period_code_index"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateskill",
            name="normalized_name",
            field=models.CharField(blank=True, db_index=True, max_length=255),
        ),
        migrations.AddField(
            model_name="candidateskill",
            name="skill",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.SET_NULL,
                related_name="candidate_skills",
                to="skills.skill",
            ),
        ),
        migrations.AddIndex(
            model_name="candidateskill",
            index=models.Index(fields=["normalized_name"], name="candidates__skill_norm_idx"),
        ),
        migrations.RunPython(backfill_skill_links, migrations.RunPython.noop),
    ]
