from django.contrib import admin
from .models.board_game import BoardGame
from .models.registered_user import RegisteredUser

admin.site.register(BoardGame)
admin.site.register(RegisteredUser)
