from django.db import models

from app.utils.bgg_api import api_params


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
    publisher = models.CharField(max_length=128, null=True)
    category = models.JSONField(default=default_category)
    mechanic = models.JSONField(default=default_mechanic)
    min_players = models.PositiveSmallIntegerField(default=0, null=True)
    max_players = models.PositiveSmallIntegerField(default=0, null=True)
    age = models.PositiveSmallIntegerField(default=0, null=True)
    min_playtime = models.PositiveIntegerField(default=0, null=True)
    max_playtime = models.PositiveIntegerField(default=0, null=True)
    expansion = models.JSONField(default=default_expansion)
    description = models.TextField(default='', null=True)
    image_url = models.CharField(max_length=256, null=True)
    rating = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    setter_mapper: dict

    CATEGORY_FIELD = 'category'
    MECHANIC_FIELD = 'mechanic'
    EXPANSION_FIELD = 'expansion'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.setter_mapper = {
            api_params.NAME: self.set_name,
            api_params.YEAR_PUBLISHED: self.set_year_published,
            api_params.BOARD_GAME_CATEGORY: self.set_category,
            api_params.BOARD_GAME_PUBLISHER: self.set_publisher,
            api_params.BOARD_GAME_MECHANIC: self.set_mechanic,
            api_params.MIN_PLAYERS: self.set_min_players,
            api_params.MAX_PLAYERS: self.set_max_players,
            api_params.AGE: self.set_age,
            api_params.MIN_PLAYTIME: self.set_min_playtime,
            api_params.MAX_PLAYTIME: self.set_max_playtime,
            api_params.BOARD_GAME_EXPANSION: self.set_expansion,
            api_params.DESCRIPTION: self.set_description,
            api_params.IMAGE: self.set_image_url,
        }

    def __str__(self):
        return self.name

    def set_name(self, name: str) -> None:
        self.name = name

    def set_year_published(self, year_published: int) -> None:
        self.year_published = year_published

    def set_publisher(self, publisher: str) -> None:
        self.publisher = publisher

    def set_category(self, category: list) -> None:
        self.category[self.CATEGORY_FIELD] = category

    def set_mechanic(self, mechanic: list) -> None:
        self.mechanic[self.MECHANIC_FIELD] = mechanic

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

    def set_expansion(self, expansion: list) -> None:
        self.expansion[self.EXPANSION_FIELD] = expansion

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

    def get_categories(self) -> list:
        return self.category[self.CATEGORY_FIELD].values()

    def add_categories(self, categories: list) -> None:
        self.category[self.CATEGORY_FIELD].extend(categories)

    def get_rating(self) -> float:
        return self.rating
