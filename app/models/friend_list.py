from django.db import models
from django.contrib.auth.models import User


class FriendList(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_REMOVED = 'removed'
    STATUS_REJECTED = 'rejected'

    DoesNotExist = None
    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_friend_list')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_friend_list')
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super().save(force_insert, force_update, using, update_fields)

        if self.status in [self.STATUS_PENDING, self.STATUS_REJECTED]:
            return

        if FriendList.objects.filter(
            user_id__exact=self.friend.id,
            friend_id__exact=self.user.id
        ).exclude(status__exact=self.status).exists():
            referenced_friend = FriendList.objects.filter(
                user_id__exact=self.friend.id,
                friend_id__exact=self.user.id
            ).get()

            referenced_friend.status = self.status
            referenced_friend.save()
        elif not FriendList.objects.filter(
            user_id__exact=self.friend.id,
            friend_id__exact=self.user.id,
            status__exact=self.status
        ).exists():
            FriendList.objects.create(
                user_id=self.friend.id,
                friend_id=self.user.id,
                status=self.status
            )
