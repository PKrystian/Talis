from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf.urls import handler404
from app.views import custom_404_view

handler404 = custom_404_view

urlpatterns = [
    path('', include('app.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^collection/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^events/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^policy/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^game/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^register/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^search/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^advanced-search/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^license/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^create-event/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user-events/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^forgot-password/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^settings/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^game-add/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^robots\.txt$', TemplateView.as_view(template_name='robots.txt', content_type='text/plain')),
    re_path(r'^verify/', TemplateView.as_view(template_name='index.html')),
]
