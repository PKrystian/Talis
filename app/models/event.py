from typing import List
from django.db import models
from app.models.registered_user import User
from app.models.board_game import BoardGame
from app.models.category import Category


class Event(models.Model):
    ID = "id"
    TITLE = 'title'
    HOST = 'host'
    CITY = 'city'
    ZIP_CODE = 'zip_code'
    STREET = 'street'
    BOARD_GAMES = 'board_games'
    TAGS = 'tags'
    DESCRIPTION = 'description'
    ATTENDEES = 'attendees'
    MAX_PLAYERS = 'max_players'
    EVENT_START_DATE = 'event_start_date'
    COORDINATES = 'coordinates'

    objects = None
    title = models.CharField(max_length=128, null=False)
    host = models.ForeignKey(User, related_name='host', on_delete=models.CASCADE)
    city = models.CharField(max_length=256, null=False)
    zip_code = models.CharField(max_length=32, null=True)
    street = models.CharField(max_length=256, null=True)
    board_games = models.ManyToManyField(BoardGame)
    tags = models.ManyToManyField(Category)
    description = models.TextField(default='', null=True)
    attendees = models.ManyToManyField(User, related_name='attendees')
    max_players = models.PositiveSmallIntegerField(default=0, null=True)
    event_start_date = models.DateTimeField(null=False)
    coordinates = models.JSONField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    setter_mapper: dict

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.setter_mapper = {
            self.TITLE: self.set_title,
            self.HOST: self.set_host,
            self.CITY: self.set_city,
            self.ZIP_CODE: self.set_zip_code,
            self.STREET: self.set_street,
            self.DESCRIPTION: self.set_description,
            self.MAX_PLAYERS: self.set_max_players,
            self.EVENT_START_DATE: self.set_event_start_date,
            self.COORDINATES: self.set_coordinates,
        }

    def __str__(self):
        return self.title

    def set_title(self, title: str) -> None:
        self.title = title

    def set_host(self, host: str) -> None:
        self.host = host

    def set_city(self, city: str) -> None:
        self.city = city

    def set_zip_code(self, zip_code: str) -> None:
        self.zip_code = zip_code

    def set_street(self, street: str) -> None:
        self.street = street

    def set_board_games(self, board_games: List) -> None:
        self.board_games.add(*board_games)

    def set_tags(self, tags: List) -> None:
        self.tags.add(*tags)

    def set_description(self, description: str) -> None:
        self.description = description

    def set_attendees(self, attendees: List) -> None:
        self.attendees.add(*attendees)

    def set_max_players(self, max_players: int | str) -> None:
        if type(max_players) is str:
            max_players = int(max_players)
        self.max_players = max_players

    def set_event_start_date(self, event_start_date) -> None:
        self.event_start_date = event_start_date

    def set_coordinates(self, coordinates: dict) -> None:
        self.coordinates = coordinates

    def serialize(self) -> dict:
        return {
            self.ID: self.id,
            self.TITLE: self.title,
            self.HOST: self.serialize_host(),
            self.CITY: self.city,
            self.ZIP_CODE: self.zip_code,
            self.STREET: self.street,
            self.BOARD_GAMES: self.serialize_board_games(),
            self.TAGS: self.serialize_tags(),
            self.DESCRIPTION: self.description,
            self.ATTENDEES: self.serialize_attendees(),
            self.MAX_PLAYERS: self.max_players,
            self.EVENT_START_DATE: self.event_start_date,
            self.COORDINATES: self.coordinates,
        }
    
    def serialize_host(self) -> dict:
        return {
            'id': self.host.id,
            'first_name': self.host.first_name,
            'last_name': self.host.last_name,
        }
    
    def serialize_board_games(self) -> list:
        if self.board_games:
            board_games = self.board_games.all()
            return [{
                'id': board_game.id,
                'name': board_game.name,
                'image_url': board_game.image_url,
                } for board_game in board_games]
        return []

    def serialize_tags(self) -> list:
        if self.tags:
            tags = self.tags.all()
            return [tag.name for tag in tags]
        return []

    def serialize_attendees(self) -> list:
        if self.attendees:
            attendees = self.attendees.all()
            return [
                {
                    'id': attendee.id,
                    'email': attendee.email,
                }
                for attendee in attendees
            ]
        return []
