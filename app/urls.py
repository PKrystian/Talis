from . import views
from django.urls import path

urlpatterns = [
    path('', views.index, name='index'),
    path('api/animals/', views.animal_list, name='animal-list'),
]
