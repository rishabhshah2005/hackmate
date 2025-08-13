from django.urls import path
from .views import HackathonListCreateView, HackathonRetrieveView, FavoriteHackathonListCreateView, FavoriteHackathonDeleteView, HackathonSearchView

urlpatterns = [
    path('', HackathonListCreateView.as_view(), name='hackathon-list-create'),
    path('<int:pk>/', HackathonRetrieveView.as_view(), name='hackathon-detail'),
    path('favorites/', FavoriteHackathonListCreateView.as_view(), name='favorite-hackathon-list-create'),
    path('favorites/<int:pk>/', FavoriteHackathonDeleteView.as_view(), name='favorite-hackathon-delete'),
    path('search/', HackathonSearchView.as_view(), name='hackathon-search'),
]
