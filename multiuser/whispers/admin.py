from django.contrib import admin

# Register your models here.

from .models import Interpretation, Whisper

admin.site.register(Interpretation)
admin.site.register(Whisper)