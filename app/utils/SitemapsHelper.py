from app.utils.sitemaps import BoardGameSitemap
from django.contrib.sitemaps.views import sitemap


def board_game_sitemap_view(request, offset):
    offset = int(offset) * BoardGameSitemap.limit
    return sitemap(request, {'boardgames': BoardGameSitemap(offset=offset)})