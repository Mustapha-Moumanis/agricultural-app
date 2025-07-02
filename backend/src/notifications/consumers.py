import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from alerts.models import Alert
from alerts.serializers import AlertSerializer

class AlertConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'alerts'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', '')
        
        if message_type == 'get_alerts':
            await self.send_alerts_list()
        elif message_type == 'create_alert':
            await self.create_alert(data)
        elif message_type == 'ping':
            await self.send_pong()

    async def send_pong(self):
        await self.send(text_data=json.dumps({
            'type': 'pong',
            'message': 'Connection alive'
        }))

    async def send_alerts_list(self):
        alerts = await self.get_alerts()
        await self.send(text_data=json.dumps({
            'type': 'alerts_list',
            'alerts': alerts
        }))

    async def create_alert(self, data):
        alert = await self.save_alert(data)
        if alert:
            # Broadcast to all connected farmers
            await self.channel_layer.group_send(
                self.group_name,
                {
                    'type': 'new_alert',
                    'alert': alert
                }
            )

    @database_sync_to_async
    def save_alert(self, data):
        serializer = AlertSerializer(data=data)
        if serializer.is_valid():
            alert = serializer.save(author=self.scope['user'])
            return AlertSerializer(alert).data
        return None

    @database_sync_to_async
    def get_alerts(self):
        alerts = Alert.objects.all().order_by('-date')
        return AlertSerializer(alerts, many=True).data

    # ===== Notification Handlers =====
    async def new_alert(self, event):
        await self.send(text_data=json.dumps({
            'type': 'new_alert',
            'alert': event['alert']
        }))

    async def alert_updated(self, event):
        await self.send(text_data=json.dumps({
            'type': 'alert_updated',
            'alert': event['alert']
        }))

    async def alert_deleted(self, event):
        await self.send(text_data=json.dumps({
            'type': 'alert_deleted',
            'alert_id': event['alert_id']
        }))