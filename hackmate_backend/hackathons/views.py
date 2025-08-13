from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Hackathon, FavoriteHackathon
from .serializers import HackathonSerializer, FavoriteHackathonSerializer
from django.db.models import Q


class HackathonListCreateView(generics.ListCreateAPIView):
	queryset = Hackathon.objects.all().order_by('-start_date')
	serializer_class = HackathonSerializer
	filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
	filterset_fields = ['platform', 'is_virtual', 'themes', 'location', 'prize_pool']
	search_fields = ['title', 'description', 'themes', 'sponsors', 'tags']
	ordering_fields = ['start_date', 'prize_pool', 'participants', 'registration_deadline']


class HackathonRetrieveView(generics.RetrieveAPIView):
	queryset = Hackathon.objects.all()
	serializer_class = HackathonSerializer


class FavoriteHackathonListCreateView(generics.ListCreateAPIView):
	serializer_class = FavoriteHackathonSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return FavoriteHackathon.objects.filter(user=self.request.user)

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class FavoriteHackathonDeleteView(generics.DestroyAPIView):
	serializer_class = FavoriteHackathonSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self):
		return FavoriteHackathon.objects.filter(user=self.request.user)


class HackathonSearchView(generics.ListAPIView):
	serializer_class = HackathonSerializer

	def get_queryset(self):
		query = self.request.query_params.get('q', '')
		return Hackathon.objects.filter(
			Q(title__icontains=query) |
			Q(description__icontains=query) |
			Q(themes__icontains=query) |
			Q(tags__icontains=query)
		)
