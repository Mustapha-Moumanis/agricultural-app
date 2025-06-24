from dj_rest_auth.registration.views import VerifyEmailView
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CustomVerifyEmailSerializer, UserLocationSerializer
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

from rest_framework.views import APIView
from .models import User

class UpdateUserLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UserLocationSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     permission_classes = [IsAuthenticated]

#     @action(detail=False, methods=['patch'], url_path='set-location')
#     def set_location(self, request):
#         serializer = UserLocationSerializer(instance=request.user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"status": "location set"})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserLocationViewSet(viewsets.ViewSet):
#     permission_classes = [IsAuthenticated]

#     def partial_update(self, request, *args, **kwargs):
#         serializer = UserLocationSerializer(instance=request.user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"status": "Location set"})
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
