from rest_framework import serializers

from apps.accounts.models import User
from ..models import CandidateProfile


class CandidateRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            role=User.Role.CANDIDATE,
            phone=validated_data.get("phone", ""),
        )
        profile = CandidateProfile.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
            location=validated_data.get("location", ""),
            summary="",
            location_country="India",
            work_status="",
            availability_to_join="",
        )
        return profile
