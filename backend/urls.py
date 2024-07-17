from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('', include('app.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^contact/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^about/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^user/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^game/', TemplateView.as_view(template_name='index.html')),
    re_path(r'^register/', TemplateView.as_view(template_name='index.html')),
]
