from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0009_merge_20260212_1133"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="is_searchable",
            field=models.BooleanField(default=False),
        ),
    ]
