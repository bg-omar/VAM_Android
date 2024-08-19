import django.contrib
from .models import Spaceship


@django.contrib.admin.register(Spaceship)
class SpaceshipAdmin(django.contrib.admin.ModelAdmin):
    list_display = ('name', 'type', 'top_speed')
    ordering = ['name']
