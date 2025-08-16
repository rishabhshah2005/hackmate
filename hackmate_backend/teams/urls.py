from django.urls import path
from .views import *

urlpatterns = [
    path("get_hackathons/", get_hackathons, name='get_hackathons'),
]
