from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('interpretation', views.add_interpretation, name='interpretation'),
    path('whisper', views.add_whisper, name='whisper'),
    path('whisper-chain', views.show_whispers, name='whisper-chain'),
]