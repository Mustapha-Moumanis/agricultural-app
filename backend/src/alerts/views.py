from math import radians, sin, cos, asin, sqrt
from rest_framework import viewsets, permissions
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Alert
from .serializers import AlertSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Alert.objects.all()
    
    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        radius = self.request.query_params.get('radius')
        
        if lat and lng and radius:
            try:
                lat = float(lat)
                lng = float(lng)
                radius = float(radius)
                # Store user location in request for serializer
                self.request.user_lat = lat
                self.request.user_lng = lng
                # Get filtered queryset
                queryset = self.filter_by_location(queryset, lat, lng, radius)
            except (ValueError, TypeError):
                # Invalid parameters - return unfiltered queryset
                pass
        return queryset.order_by('-date')
    
    @action(detail=False, methods=['get'], url_path='my-alerts')
    def my_alerts(self, request):
        """
        Get all alerts created by the authenticated user.
        Supports the same location filtering as the main endpoint.
        """
        # Filter alerts by the current user as author
        queryset = Alert.objects.filter(author=request.user)
        queryset = queryset.order_by('-date')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def filter_by_location(self, queryset, user_lat, user_lng, radius_km):
        """Filter alerts within radius using bounding box approximation first"""
        # First filter by rough bounding box to reduce Haversine calculations
        approx_degree = radius_km / 111.32  # ~1 degree = 111.32 km
        bbox_filter = Q(
            latitude__range=(user_lat - approx_degree, user_lat + approx_degree),
            longitude__range=(user_lng - approx_degree, user_lng + approx_degree)
        )
        # Get filtered queryset
        alerts_in_bbox = queryset.filter(bbox_filter)
        
        # Get IDs of alerts within the radius
        alert_ids = [
            alert.id for alert in alerts_in_bbox
            if self.calculate_distance(user_lng, user_lat, alert.longitude, alert.latitude) <= radius_km
        ]
        
        # Return new queryset filtered by these IDs
        return queryset.filter(id__in=alert_ids)
    
    @staticmethod
    def calculate_distance(lon1, lat1, lon2, lat2):
        """Calculate great circle distance between two points (in km)"""
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        return 6371 * 2 * asin(sqrt(a))  # Earth radius in km
    
    def perform_create(self, serializer):
        alert = serializer.save()
        
        # Broadcast new alert via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'alerts',
            {
                'type': 'new_alert',
                'alert': AlertSerializer(alert).data
            }
        )
    
    def perform_update(self, serializer):
        alert = serializer.save()
        
        # Broadcast alert update via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'alerts',
            {
                'type': 'alert_updated',
                'alert': AlertSerializer(alert).data
            }
        )
    
    def perform_destroy(self, instance):
        alert_id = str(instance.id)
        instance.delete()
        
        # Broadcast alert deletion via WebSocket
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'alerts',
            {
                'type': 'alert_deleted',
                'alert_id': alert_id
            }
        )