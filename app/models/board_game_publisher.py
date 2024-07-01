from django.db import models
from app.models.board_game import BoardGame
from app.models.publisher import Publisher


class BoardGamePublisher(models.Model):
    objects = None
    board_game = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
