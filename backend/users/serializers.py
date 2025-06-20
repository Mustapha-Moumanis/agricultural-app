from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.utils.translation import gettext_lazy as _
# from django.contrib.auth import get_user_model
from .models import User
import re

# Register
from allauth.account.adapter import get_adapter
from allauth.account import app_settings as allauth_account_settings

class CustomRegisterSerializer(RegisterSerializer):
    """
    Custom serializer for user registration.
    This serializer extends the default RegisterSerializer to include additional fields.
    """

    role = serializers.ChoiceField(choices=["AGRONOME", "FERMIER"])

    def validate_username(self, username):
      """
      Validate the username to ensure it is alphanumeric and does not contain special characters.
      """
      pattern = r'^[a-zA-Z0-9-_]+$'
      if not re.match(pattern, username):
        raise serializers.ValidationError(_("Username must be alphanumeric and can include underscores."))
      return username

    def validate_email(self, email):
      email = get_adapter().clean_email(email)
      if allauth_account_settings.UNIQUE_EMAIL:
        if User.objects.filter(email=email).exists():
          raise serializers.ValidationError('A user is already registered with this e-mail address.')
      return email
      
    def custom_signup(self, request, user):
      user.role = self.validated_data.get('role')
      user.save()
      return user