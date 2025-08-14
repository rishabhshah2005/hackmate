from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_team, name='createteam'),
    path("get_hackathons/", get_hackathons, name='get_hackathons'),
]
