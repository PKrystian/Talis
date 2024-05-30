from django.db import models


class BoardGame(models.Model):
    @staticmethod
    def __default_category() -> dict[str, list]:
        return {'category': []}

    @staticmethod
    def __default_mechanic() -> dict[str, list]:
        return {'mechanic': []}

    @staticmethod
    def __default_expansion() -> dict[str, list]:
        return {'expansion': []}

    objects = None
    name = models.CharField(max_length=256, unique=True)
    year_published = models.PositiveSmallIntegerField(null=True)
    publisher = models.CharField(max_length=128, null=True)
    category = models.JSONField(default=__default_category)
    mechanic = models.JSONField(default=__default_mechanic)
    min_players = models.PositiveSmallIntegerField(default=0, null=True)
    max_players = models.PositiveSmallIntegerField(default=0, null=True)
    age = models.PositiveSmallIntegerField(default=0, null=True)
    min_playtime = models.PositiveIntegerField(default=0, null=True)
    max_playtime = models.PositiveIntegerField(default=0, null=True)
    expansion = models.JSONField(default=__default_expansion)
    description = models.TextField(default='', null=True)
    image_url = models.CharField(max_length=256, unique=True, null=True)

    def __str__(self):
        return self.name
