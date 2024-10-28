from django.contrib.auth.models import User
from django.db import models

from app.models.event import Event


class Invite(models.Model):
    INVITED_FRIENDS = 'invited_friends'
    INVITE_TYPE_EVENT = 'event'

    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inviting_user')
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invited_user')
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    type = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
