from django.contrib import admin
from .models.board_game import BoardGame
from .models.log_error import LogError
from .models.registered_user import RegisteredUser

admin.site.register(BoardGame)
admin.site.register(RegisteredUser)
admin.site.register(LogError)
