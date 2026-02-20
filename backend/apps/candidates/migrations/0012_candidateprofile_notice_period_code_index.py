from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0011_candidateprofile_notice_period_code"),
    ]

    operations = [
        migrations.AddIndex(
            model_name="candidateprofile",
            index=models.Index(fields=["notice_period_code"], name="candidates__notice_code_idx"),
        ),
    ]
