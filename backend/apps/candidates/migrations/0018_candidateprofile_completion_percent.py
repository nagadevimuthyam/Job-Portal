from django.db import migrations, models
from django.core.validators import MaxValueValidator, MinValueValidator


class Migration(migrations.Migration):
    dependencies = [
        ("candidates", "0017_rename_candidates__created_at_idx_candidates__created_2f4697_idx_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="profile_completion_percent",
            field=models.PositiveSmallIntegerField(
                default=0,
                validators=[MinValueValidator(0), MaxValueValidator(100)],
            ),
        ),
    ]
