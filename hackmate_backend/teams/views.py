from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import *
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from .serializers import *
from django.middleware.csrf import get_token
from .models import *
from authentication.models import *
from django.db.models import Q, Sum
from django.http import HttpRequest
import datetime
from rest_framework import status
from hackathons.models import Hackathon
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(["POST"])
@permission_classes([AllowAny])
def create_team(request):
    # Extract data from request
    team_name = request.data.get("name")
    description = request.data.get("description", "")
    max_members = request.data.get("max_members", 4)
    is_recruiting = request.data.get("is_recruiting", True)
    is_private = request.data.get("is_private", False)
    project_name = request.data.get("project_name", "")
    project_description = request.data.get("project_description", "")
    github_repo = request.data.get("github_repo", "")
    demo_url = request.data.get("demo_url", "")
    hackathon_id = request.data.get("hackathon", 1)

    # Validate required fields
    if not team_name:
        return Response({"error": "Team name is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not hackathon_id:
        return Response({"error": "Hackathon ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    # Validate hackathon exists
    try:
        hackathon = Hackathon.objects.get(id=hackathon_id)
    except Hackathon.DoesNotExist:
        return Response({"error": "Hackathon not found"}, status=status.HTTP_404_NOT_FOUND)

    # Create the team
    customeruser = CustomUser.objects.all()[1]
    print(customeruser)
    
    team = Team.objects.create(
            name=team_name,
            description=description,
            hackathon=hackathon,
            leader=customeruser,
            max_members=max_members,
            is_recruiting=is_recruiting,
            is_private=is_private,
            project_name=project_name,
            project_description=project_description,
            github_repo=github_repo,
            demo_url=demo_url
        )
        
        # Add leader as first member
    team.members.add(customeruser)
        
        # Prepare response data
    response_data = {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "hackathon": team.hackathon.id,
            "leader": team.leader.id,
            "max_members": team.max_members,
            "is_recruiting": team.is_recruiting,
            "is_private": team.is_private,
            "project_name": team.project_name,
            "project_description": team.project_description,
            "github_repo": team.github_repo,
            "demo_url": team.demo_url,
            "created_at": team.created_at,
            "message": "Team created successfully"
        }
        
    return Response(response_data, status=status.HTTP_201_CREATED)
    
    