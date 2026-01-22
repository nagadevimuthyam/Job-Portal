from django.urls import path

from .views import LoginView, MeView, RefreshView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
]
