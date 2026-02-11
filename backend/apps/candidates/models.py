import uuid
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class CandidateProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_profile",
    )
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=200, blank=True)
    location_country = models.CharField(max_length=60, default="India")
    summary = models.TextField(blank=True)
    work_status = models.CharField(max_length=20, blank=True)
    availability_to_join = models.CharField(max_length=30, blank=True)
    total_experience_years = models.PositiveSmallIntegerField(default=0)
    total_experience_months = models.PositiveSmallIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(11)],
    )
    notice_period_days = models.PositiveIntegerField(null=True, blank=True)
    expected_salary = models.PositiveIntegerField(null=True, blank=True)
    resume_file = models.FileField(upload_to="resumes/", null=True, blank=True)
    photo_file = models.FileField(upload_to="profile-photos/", null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [
            models.Index(fields=["updated_at"]),
            models.Index(fields=["location"]),
            models.Index(fields=["notice_period_days"]),
            models.Index(fields=["expected_salary"]),
        ]

    def __str__(self):
        return self.full_name


class CandidateSkill(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="skills",
    )
    name = models.CharField(max_length=120)

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["name"])]

    def __str__(self):
        return self.name


class CandidateEmployment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="employments",
    )
    company = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_date"]
        indexes = [models.Index(fields=["start_date"]), models.Index(fields=["is_current"])]

    def __str__(self):
        return f"{self.title} @ {self.company}"


class CandidateEducation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="educations",
    )
    degree = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    course_type = models.CharField(max_length=40, blank=True)
    start_year = models.PositiveSmallIntegerField()
    end_year = models.PositiveSmallIntegerField()
    marks_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ["-end_year", "-start_year"]
        indexes = [models.Index(fields=["end_year"])]

    def __str__(self):
        return f"{self.degree} @ {self.institution}"


class CandidateProject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(
        CandidateProfile,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    link = models.URLField(blank=True)
    status = models.CharField(max_length=20, blank=True)
    worked_from_year = models.PositiveSmallIntegerField(null=True, blank=True)
    worked_from_month = models.PositiveSmallIntegerField(null=True, blank=True)
    worked_till_year = models.PositiveSmallIntegerField(null=True, blank=True)
    worked_till_month = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
