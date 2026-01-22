from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="phone",
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AddField(
            model_name="user",
            name="address",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(choices=[("MASTER_ADMIN", "Master Admin"), ("EMPLOYER", "Employer"), ("CANDIDATE", "Candidate")], max_length=20),
        ),
    ]
