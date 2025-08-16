from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from hackathons.models import Hackathon
from django.contrib.auth import get_user_model

User = get_user_model()

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = [
            'id', 'name', 'description', 'hackathon', 'leader', 'members',
            'max_members', 'is_recruiting', 'is_private', 'project_name',
            'project_description', 'github_repo', 'demo_url', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'leader', 'members', 'created_at', 'updated_at']

    def validate_hackathon(self, value):
        if not Hackathon.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Hackathon does not exist")
        return value

    def validate_leader(self, value):
        if not User.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("User does not exist")
        return value