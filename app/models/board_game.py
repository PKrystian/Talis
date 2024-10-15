from django.db import models

from app.utils.bgg_api import bgg_api_params


def default_category() -> dict[str, list]:
    return {'category': []}


def default_mechanic() -> dict[str, list]:
    return {'mechanic': []}


def default_expansion() -> dict[str, list]:
    return {'expansion': []}


class BoardGame(models.Model):
    DoesNotExist = None
    objects = None
    name = models.CharField(max_length=256)
    year_published = models.SmallIntegerField(null=True)
    min_players = models.PositiveSmallIntegerField(default=0, null=True)
    max_players = models.PositiveSmallIntegerField(default=0, null=True)
    age = models.PositiveSmallIntegerField(default=0, null=True)
    min_playtime = models.PositiveIntegerField(default=0, null=True)
    max_playtime = models.PositiveIntegerField(default=0, null=True)
    description = models.TextField(default='', null=True)
    image_url = models.CharField(max_length=256, null=True)
    rating = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    setter_mapper: dict

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.setter_mapper = {
            bgg_api_params.NAME: self.set_name,
            bgg_api_params.YEAR_PUBLISHED: self.set_year_published,
            bgg_api_params.MIN_PLAYERS: self.set_min_players,
            bgg_api_params.MAX_PLAYERS: self.set_max_players,
            bgg_api_params.AGE: self.set_age,
            bgg_api_params.MIN_PLAYTIME: self.set_min_playtime,
            bgg_api_params.MAX_PLAYTIME: self.set_max_playtime,
            bgg_api_params.DESCRIPTION: self.set_description,
            bgg_api_params.IMAGE: self.set_image_url,
        }

    def __str__(self):
        return self.name

    def set_name(self, name: str) -> None:
        self.name = name

    def set_year_published(self, year_published: int) -> None:
        self.year_published = year_published

    def set_min_players(self, min_players: int) -> None:
        self.min_players = min_players

    def set_max_players(self, max_players: int) -> None:
        self.max_players = max_players

    def set_age(self, age: int) -> None:
        self.age = age

    def set_min_playtime(self, min_playtime: int) -> None:
        self.min_playtime = min_playtime

    def set_max_playtime(self, max_playtime: int) -> None:
        self.max_playtime = max_playtime

    def set_description(self, description: str) -> None:
        self.description = description

    def set_image_url(self, image_url: str) -> None:
        self.image_url = image_url

    def set_rating(self, rating: float) -> None:
        self.rating = rating

    def get_name(self) -> str:
        return self.name

    def get_description(self) -> str:
        return self.description

    def get_rating(self) -> float:
        return self.rating

    class Meta:
        indexes = [
            models.Index(fields=['rating']),
            models.Index(fields=['name']),
            models.Index(fields=['min_players']),
            models.Index(fields=['max_players']),
            models.Index(fields=['age']),
            models.Index(fields=['min_playtime']),
            models.Index(fields=['max_playtime']),
        ]
