from django.contrib import admin
from .models.board_game import BoardGame
from .models.log_error import LogError
from .models.registered_user import RegisteredUser
from .models.event import Event

admin.site.register(BoardGame)
admin.site.register(LogError)
admin.site.register(RegisteredUser)
admin.site.register(Event)
