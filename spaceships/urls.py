import django.conf.urls
from django.template.defaulttags import url
from rest_framework import routers

from . import views

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'spaceships', views.SpaceshipViewSet)

urlpatterns = [
    url(r'^api/', django.conf.urls.include(router.urls)),
    url(r'^$', views.index, name='index')
]
