from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class LoginSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "phone": user.phone,
            "address": user.address,
        }
        if user.organization_id:
            data["user"]["organization"] = {
                "id": str(user.organization_id),
                "name": user.organization.name,
                "code": user.organization.code,
            }
        return data


class UserMeSerializer(serializers.ModelSerializer):
    organization = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "full_name", "role", "phone", "address", "organization")

    def get_organization(self, obj):
        if not obj.organization:
            return None
        return {
            "id": str(obj.organization_id),
            "name": obj.organization.name,
            "code": obj.organization.code,
        }
