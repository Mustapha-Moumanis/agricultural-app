from django.urls import path, re_path
from .views import CustomVerifyEmailView

urlpatterns = [
    # path("auth/verify-email/", CustomVerifyEmailView.as_view(), name="rest_verify_email"),
    path('auth/verify-email/', CustomVerifyEmailView.as_view(), name='rest_verify_email'),
]