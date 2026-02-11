from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("candidates", "0003_candidateprofile_availability_to_join_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateeducation",
            name="course_type",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name="candidateeducation",
            name="marks_percentage",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True),
        ),
    ]
