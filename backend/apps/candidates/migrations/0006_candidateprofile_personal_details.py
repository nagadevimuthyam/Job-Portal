from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("candidates", "0005_alter_candidateeducation_course_type_and_more"),
        ("candidates", "0005_candidateproject_status_and_dates"),
    ]

    operations = [
        migrations.AddField(
            model_name="candidateprofile",
            name="gender",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="dob",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="current_city",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="current_state",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="country",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="nationality",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="marital_status",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="candidateprofile",
            name="work_authorization_country",
            field=models.CharField(blank=True, max_length=120),
        ),
    ]

