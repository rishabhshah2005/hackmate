from rest_framework import serializers
from .models import Hackathon, FavoriteHackathon

class HackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hackathon
        fields = "__all__"

class FavoriteHackathonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteHackathon
        fields = "__all__"
