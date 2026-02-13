from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("candidates", "0006_candidateprofile_personal_details"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="salary_currency",
            field=models.CharField(blank=True, default="INR", max_length=8),
        ),
    ]

