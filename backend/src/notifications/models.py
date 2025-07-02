from django.db import models
from users.models import User
import uuid


# Create your models here.
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('alert_created', 'Alert Created'),
        ('alert_updated', 'Alert Updated'),
        ('alert_deleted', 'Alert Deleted'),
        ('system', 'System'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    is_read = models.BooleanField(default=False)
    alert = models.ForeignKey('alerts.Alert', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.creater.username}"