from rest_framework.permissions import BasePermission

from apps.accounts.models import User


class IsMasterAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == User.Role.MASTER_ADMIN
        )


class IsEmployer(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == User.Role.EMPLOYER
        )


class IsCandidate(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == User.Role.CANDIDATE
        )
