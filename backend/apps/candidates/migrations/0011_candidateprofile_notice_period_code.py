from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0010_candidateprofile_is_searchable"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="notice_period_code",
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
