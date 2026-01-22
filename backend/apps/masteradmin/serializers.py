from django.db import transaction
from rest_framework import serializers
from django.utils.text import slugify

from apps.accounts.models import User
from apps.organizations.models import Organization


def _generate_org_code(name):
    base = slugify(name).upper().replace("-", "")[:10] or "ORG"
    code = f"{base}01"
    counter = 1
    while Organization.objects.filter(code__iexact=code).exists():
        counter += 1
        code = f"{base}{counter:02d}"
    return code


class OrganizationSerializer(serializers.ModelSerializer):
    employer_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Organization
        fields = ("id", "name", "code", "is_active", "created_at", "employer_count")


class OrganizationCreateSerializer(serializers.ModelSerializer):
    code = serializers.CharField(max_length=50, required=False, allow_blank=True)

    class Meta:
        model = Organization
        fields = ("id", "name", "code", "address", "contact_number", "is_active")
        read_only_fields = ("id",)

    def validate_name(self, value):
        if Organization.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("Organization name already exists.")
        return value

    def validate_code(self, value):
        if value and Organization.objects.filter(code__iexact=value).exists():
            raise serializers.ValidationError("Organization code already exists.")
        return value

    def create(self, validated_data):
        code = validated_data.pop("code", "").strip()
        if not code:
            code = _generate_org_code(validated_data["name"])
        return Organization.objects.create(code=code, **validated_data)


class EmployerListSerializer(serializers.ModelSerializer):
    org_name = serializers.CharField(source="organization.name")

    class Meta:
        model = User
        fields = ("id", "full_name", "email", "phone", "org_name", "is_active", "created_at")


class EmployerCreateSerializer(serializers.Serializer):
    organization_id = serializers.UUIDField()
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(max_length=30)
    address = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_organization_id(self, value):
        if not Organization.objects.filter(id=value).exists():
            raise serializers.ValidationError("Organization not found.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        org = Organization.objects.get(id=validated_data["organization_id"])
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            phone=validated_data.get("phone", ""),
            address=validated_data.get("address", ""),
            role=User.Role.EMPLOYER,
            organization=org,
            is_active=True,
        )
        return user
