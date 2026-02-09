from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Skill",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True, primary_key=True, serialize=False, verbose_name="ID"
                    ),
                ),
                ("name", models.CharField(max_length=255)),
                ("normalized_name", models.CharField(db_index=True, max_length=255, unique=True)),
                ("alt_labels", models.TextField(blank=True, default="")),
                ("source_uri", models.TextField(blank=True, default="")),
                ("popularity", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "indexes": [models.Index(fields=["normalized_name"], name="skills_skil_normal_51e33a_idx")],
            },
        ),
    ]
