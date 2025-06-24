from django.urls import path, re_path
from .views import CustomVerifyEmailView, UpdateUserLocationView

urlpatterns = [
    # path("auth/verify-email/", CustomVerifyEmailView.as_view(), name="rest_verify_email"),
    path('auth/verify-email/', CustomVerifyEmailView.as_view(), name='rest_verify_email'),
    path('user/location/', UpdateUserLocationView.as_view(), name='user-location-update'),
]