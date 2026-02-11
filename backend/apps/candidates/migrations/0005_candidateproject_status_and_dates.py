from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("candidates", "0004_candidateeducation_course_type_and_marks"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateproject",
            name="status",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="candidateproject",
            name="worked_from_year",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateproject",
            name="worked_from_month",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateproject",
            name="worked_till_year",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateproject",
            name="worked_till_month",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
    ]
