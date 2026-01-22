from django.db import migrations, models


def _populate_codes(apps, schema_editor):
    Organization = apps.get_model("organizations", "Organization")
    for org in Organization.objects.all():
        if not org.code:
            org.code = f"ORG-{str(org.id)[:8].upper()}"
            org.save(update_fields=["code"])


class Migration(migrations.Migration):
    dependencies = [
        ("organizations", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="organization",
            name="code",
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.RunPython(code=_populate_codes, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name="organization",
            name="code",
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
