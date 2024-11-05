from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from app.models.board_game import BoardGame
from django.contrib.sitemaps import Sitemap, GenericSitemap
from django.http import HttpResponse
from django.template.response import TemplateResponse

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
    def items(self):
        board_game_count = BoardGame.objects.count()
        return range(0, board_game_count, BoardGameSitemap.limit)

    def location(self, item):
        return reverse('board-game-sitemap', args=[item // BoardGameSitemap.limit])

    def get_urls(self, page=1, site=None, protocol=None):
        urls = []
        for item in self.items():
            loc = self.location(item)
            url_info = {
                'location': loc,
                'lastmod': None,
                'changefreq': None,
                'priority': None,
                'alternates': [],
            }
            urls.append(url_info)
        return urls

def sitemap_index(request, sitemaps, **kwargs):
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for section, site in sitemaps.items():
        if callable(site):
            site = site()
        for url in site.get_urls():
            xml.append(f'<sitemap><loc>{request.build_absolute_uri(url["location"])}</loc></sitemap>')
    xml.append('</sitemapindex>')
    return HttpResponse('\n'.join(xml), content_type='application/xml')