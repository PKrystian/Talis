from django.shortcuts import render
from django.http import JsonResponse
from .models import Animal


def index(request):
    return render(request, 'index.html')


def animal_list(request):
    animals = Animal.objects.all()
    data = [{'id': animal.id, 'name': animal.name, 'species': animal.species, 'age': animal.age} for animal in animals]
    return JsonResponse(data, safe=False)
