from django.db import models
from app.models import BoardGame


class BoardGameExpansion(models.Model):
    objects = None
    main_board_game = models.ForeignKey(BoardGame, related_name='expansions', on_delete=models.CASCADE)
    expansion_board_game = models.ForeignKey(BoardGame, related_name='main_game_expansions', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('main_board_game', 'expansion_board_game')
