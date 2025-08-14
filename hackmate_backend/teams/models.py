from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Team(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    hackathon = models.ForeignKey(
        'hackathons.Hackathon',
        on_delete=models.CASCADE
    )
    leader = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='led_teams'
    )
    members = models.ManyToManyField(
        User,
        through='TeamMembership',
        related_name='teams'
    )

    # Team Settings
    max_members = models.PositiveIntegerField(default=4)
    is_recruiting = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)

    # Project Details
    project_name = models.CharField(max_length=200, blank=True)
    project_description = models.TextField(blank=True)
    github_repo = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.hackathon.title}"


class TeamMembership(models.Model):
    ROLE_CHOICES = [
        ('leader', 'Team Leader'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('project_manager', 'Project Manager'),
        ('data_scientist', 'Data Scientist'),
        ('marketing', 'Marketing'),
        ('business', 'Business Analyst'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('removed', 'Removed'),
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['team', 'user']


class TeamInvitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('expired', 'Expired'),
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_invitations'
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_invitations'
    )
    message = models.TextField(blank=True)
    proposed_role = models.CharField(
        max_length=20,
        choices=TeamMembership.ROLE_CHOICES
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        unique_together = ['team', 'recipient']
