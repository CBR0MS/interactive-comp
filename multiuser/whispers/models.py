from django.db import models
import uuid

# a model for storing the interpetations of the whispers
class Interpretation(models.Model):
    id = models.AutoField(primary_key=True)
    interpreted = models.DateField(auto_now=True)
    text = models.CharField(max_length=200)

# a model for the whispers and their interpretations 
class Whisper(models.Model):
    id = models.AutoField(primary_key=True)
    whispered = models.DateField(auto_now=True)
    og_text = models.CharField(max_length=200)
    display_text = models.CharField(max_length=200, blank=True)
    interpretations = models.ManyToManyField(Interpretation, blank=True)
    intentification_num = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_by_user_id = models.UUIDField(blank=True, null=True)
