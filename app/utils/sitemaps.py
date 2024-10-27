from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from app.models.board_game import BoardGame


def board_game_sitemap_view(request, offset):
    return BoardGameSitemap(offset).get_sitemap()

class BoardGameSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    limit = 1000

    def __init__(self, offset=0):
        self.offset = offset

    def items(self):
        return BoardGame.objects.all()[self.offset:self.offset + self.limit]

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f'/game/{obj.id}'


class MainSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        board_game_count = BoardGame.objects.count()
        return range(0, board_game_count, BoardGameSitemap.limit)

    def location(self, item):
        return reverse('board-game-sitemap', args=[item // BoardGameSitemap.limit])
