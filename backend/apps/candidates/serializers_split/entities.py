from rest_framework import serializers

from ..models import (
    CandidateSkill,
    CandidateEmployment,
    CandidateEducation,
    CandidateProject,
)


class CandidateSkillSerializer(serializers.ModelSerializer):
    skill_id = serializers.UUIDField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = CandidateSkill
        fields = ("id", "name", "skill_id")


class CandidateEmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEmployment
        fields = (
            "id",
            "company",
            "title",
            "start_date",
            "end_date",
            "is_current",
            "description",
        )


class CandidateEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEducation
        fields = (
            "id",
            "degree",
            "institution",
            "course_type",
            "start_year",
            "end_year",
            "marks_percentage",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("degree", instance.degree)
            data.setdefault("institution", instance.institution)
            data.setdefault("course_type", instance.course_type)
            data.setdefault("start_year", instance.start_year)
            data.setdefault("end_year", instance.end_year)
            data.setdefault("marks_percentage", instance.marks_percentage)

        errors = {}
        if self.instance is None:
            if not data.get("degree"):
                errors["degree"] = "Education is required."
            if not data.get("institution"):
                errors["institution"] = "University/Institute is required."
            if not data.get("course_type"):
                errors["course_type"] = "Course type is required."
            if not data.get("start_year"):
                errors["start_year"] = "Start year is required."
            if not data.get("end_year"):
                errors["end_year"] = "End year is required."

        start_year = data.get("start_year")
        end_year = data.get("end_year")
        if start_year and end_year and start_year > end_year:
            errors["end_year"] = "End year must be after start year."

        marks = data.get("marks_percentage")
        if marks is not None and (marks < 0 or marks > 100):
            errors["marks_percentage"] = "Marks/Percentage must be between 0 and 100."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


class CandidateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProject
        fields = (
            "id",
            "title",
            "description",
            "link",
            "status",
            "worked_from_year",
            "worked_from_month",
            "worked_till_year",
            "worked_till_month",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("title", instance.title)
            data.setdefault("status", instance.status)
            data.setdefault("worked_from_year", instance.worked_from_year)
            data.setdefault("worked_from_month", instance.worked_from_month)
            data.setdefault("worked_till_year", instance.worked_till_year)
            data.setdefault("worked_till_month", instance.worked_till_month)

        errors = {}
        status = data.get("status")
        if self.instance is None and not status:
            errors["status"] = "Project status is required."

        allowed_status = {"IN_PROGRESS", "FINISHED", "", None}
        if status not in allowed_status:
            errors["status"] = "Invalid project status."

        from_year = data.get("worked_from_year")
        from_month = data.get("worked_from_month")
        if status and (from_year is None or from_month is None):
            errors["worked_from_year"] = "Worked from is required."

        if status == "FINISHED":
            till_year = data.get("worked_till_year")
            till_month = data.get("worked_till_month")
            if till_year is None or till_month is None:
                errors["worked_till_year"] = "Worked till is required."
            elif from_year is not None and from_month is not None:
                from_key = int(from_year) * 12 + int(from_month)
                till_key = int(till_year) * 12 + int(till_month)
                if till_key < from_key:
                    errors["worked_till_year"] = "Worked till must be after worked from."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs
