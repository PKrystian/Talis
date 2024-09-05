from django.db import models
from django.contrib.auth.models import User
from app.models.board_game import BoardGame


class UserBoardGameCollection(models.Model):
    DoesNotExist = None
    STATUS_CHOICES = [
        ('wishlist', 'Wishlist'),
        ('library', 'Library'),
    ]

    objects = None
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    board_game = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    user_rating = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'board_game', 'status')

