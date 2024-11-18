from django.db import models
from django.contrib.auth.models import User
from app.models.board_game import BoardGame
from django.core.exceptions import ValidationError


class CommentsRatings(models.Model):
    DoesNotExist = None
    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board_game = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    comment = models.TextField(default='', max_length=5000, null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if not self.comment and self.rating is None:
            raise ValidationError('Either comment or rating must be provided.')

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)