from django.db import models
from app.models.board_game import BoardGame
from app.models.category import Category


class BoardGameCategory(models.Model):
    objects = None
    board_game = models.ForeignKey(BoardGame, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
