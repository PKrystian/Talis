from django.db import models
from app.models.board_game import BoardGame
from app.models.mechanic import Mechanic


class BoardGameMechanic(models.Model):
    objects = None
    board_game = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    mechanic = models.ForeignKey(Mechanic, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
