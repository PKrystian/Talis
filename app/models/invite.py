from django.contrib.auth.models import User
from django.db import models

from app.models.event import Event


class Invite(models.Model):
    INVITED_FRIENDS = 'invited_friends'

    INVITE_TYPE_EVENT_INVITED_FRIEND = 'event_friend_invite'
    INVITE_TYPE_EVENT_JOIN_REQUEST = 'event_join_request'

    INVITE_TYPE_NEW_FRIEND_REQUEST = 'new_friend_request'

    INVITE_EVENT_RELATION = [
        INVITE_TYPE_EVENT_INVITED_FRIEND,
        INVITE_TYPE_EVENT_JOIN_REQUEST,
    ]

    INVITE_STATUS_PENDING = 'pending'
    INVITE_STATUS_ACCEPTED = 'accepted'
    INVITE_STATUS_REJECTED = 'rejected'
    INVITE_STATUS_DISMISSED = 'dismissed'

    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inviting_user')
    invited_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invited_user')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    type = models.CharField(max_length=64)
    status = models.CharField(max_length=50, default='')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
