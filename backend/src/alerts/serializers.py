from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):

    class Meta:
        model = Alert
        fields = [
            'id', 'title', 'description', 'crop', 'location',
            'latitude', 'longitude', 'severity', 'date', 'author',
            'category', 'radius'
        ]
        read_only_fields = ['author']

    def create(self, validated_data):

        request = self.context.get('request')
        validated_data['author'] = request.user

        return super().create(validated_data)
