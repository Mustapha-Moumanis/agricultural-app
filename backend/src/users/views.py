from dj_rest_auth.registration.views import VerifyEmailView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomVerifyEmailSerializer
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC

class CustomVerifyEmailView(VerifyEmailView):

    def get_serializer(self, *args, **kwargs):
        return CustomVerifyEmailSerializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get('email')
        key = serializer.validated_data.get('key')

        try:
            email_confirmation = EmailConfirmation.objects.get(
                key=key, email_address__email=email
            )
        except EmailConfirmation.DoesNotExist:
            email_confirmation = EmailConfirmationHMAC.from_key(key)
            if not email_confirmation or email_confirmation.email_address.email != email:
                return Response({"detail": "Invalid key."}, status=status.HTTP_400_BAD_REQUEST)

        email_confirmation.confirm(request)
        return Response({"detail": "Email successfully verified."}, status=status.HTTP_200_OK)
