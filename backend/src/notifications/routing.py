from django.urls import path
from . import consumers

websocket_urlpatterns = [
    # re_path("ws/notifications/", consumers.AlertConsumer.as_asgi()),
    path("ws/notifications/", consumers.AlertConsumer.as_asgi()),
]