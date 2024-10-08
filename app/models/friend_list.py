from django.db import models
from django.contrib.auth.models import User


class FriendList(models.Model):
    DoesNotExist = None
    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friend_list')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_friend_list')
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
