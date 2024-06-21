from django.db import models


def default_category() -> dict[str, list]:
    return {'category': []}


def default_mechanic() -> dict[str, list]:
    return {'mechanic': []}


def default_expansion() -> dict[str, list]:
    return {'expansion': []}


class BoardGame(models.Model):
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
    created_at = models.DateField(auto_now_add=True, null=True)
    modified_at = models.DateField(auto_now=True)

    CATEGORY_FIELD = 'category'
    MECHANIC_FIELD = 'mechanic'
    EXPANSION_FIELD = 'expansion'

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

    def get_categories(self) -> list:
        return self.category[self.CATEGORY_FIELD].values()

    def add_categories(self, categories: list) -> None:
        self.category[self.CATEGORY_FIELD].extend(categories)
