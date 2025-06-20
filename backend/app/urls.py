"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, re_path, include
from dj_rest_auth.registration.views import RegisterView, VerifyEmailView, ResendEmailVerificationView
from dj_rest_auth.views import LoginView, LogoutView, UserDetailsView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path("admin/", admin.site.urls),
    # path('dj-rest-auth/', include('dj_rest_auth.urls')),
    # path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Authentication
    path("api/register/", RegisterView.as_view(), name="rest_register"),
    path("api/login/", LoginView.as_view(), name="rest_login"),
    path("api/logout/", LogoutView.as_view(), name="rest_logout"),
    path("api/user/", UserDetailsView.as_view(), name="rest_user_details"),
    path("api/password/change/", PasswordChangeView.as_view(), name="rest_password_change"),
    path('api/resend-email/', ResendEmailVerificationView.as_view(),
         name="rest_resend_email"),
    re_path(
        r'api/^account-confirm-email/', VerifyEmailView.as_view(),
        name='account_confirm_email',
    ),
    path('api/password/reset/', PasswordResetView.as_view(), name='rest_password_reset'),
    path('api/password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/accounts/', include('allauth.urls')),

    
    # path('api/v1/', include('api.urls')),
    # path('api/v1/auth/', include('rest_framework.urls')),
    # path('api/v1/auth/', include('dj_rest_auth.urls')),
    # path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('api/v1/auth/password/reset/', include('dj_rest_auth.password_reset.urls')),
    # path('api/v1/auth/password/change/', include('dj_rest_auth.password_change.urls')),
]
