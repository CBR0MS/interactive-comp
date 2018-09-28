from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
import uuid
import string

from .models import Interpretation, Whisper
from .forms import InterpretationForm, WhisperForm

# rendering the page to add an interpretation to a whisper 
def add_interpretation(request):
    
    # get the id of the whisper from the url params 
    whisper_id = request.GET.get('whisper', '')
    # retrieve the whisper object 
    whisper_obj = Whisper.objects.get(intentification_num=whisper_id)

    if request.method == 'POST':

        # make a fresh form on post with info filled in 
        form = InterpretationForm(request.POST)

        if form.is_valid():

            # get cleaned from data 
            interp = form.cleaned_data['interp']
            # set new display text of whisper to interpretation 
            whisper_obj.display_text = interp

            # create a new interpretation object 
            new_interp_obj = Interpretation(text=interp)
            new_interp_obj.save()

            # add the interpretation to the whisper 
            whisper_obj.interpretations.add(new_interp_obj)
            whisper_obj.save()

            redirect = 'whisper-chain?whisper=' + whisper_id

            return HttpResponseRedirect(redirect)
    else: 
        # on a GET, send a clean form to render 
        form = InterpretationForm()

    return render(request, 'interpretations.html', {'form': form, 
                                                    'whisp': whisper_id, 
                                                    'whisp_text': whisper_obj.display_text})

# rendering the page to add a new whisper 
def add_whisper(request):

    if request.method == 'POST':

        # make a new form with posted data 
        form = WhisperForm(request.POST)

        if form.is_valid():
            # create a random id for the user that made the whisper
            random_user_id = uuid.uuid4()
            # get the cleaned form data 
            whisp = form.cleaned_data['whisper']
            # create a new whisper object 
            new_whisp_obj = Whisper(og_text=whisp)
            # set the new whisper's display text to text from form 
            new_whisp_obj.display_text = whisp
            new_whisp_obj.created_by_user_id = random_user_id
            new_whisp_obj.save()
            #print(random_user_id)

            response = HttpResponseRedirect('../')
            response.set_cookie('nonuserid', random_user_id) 

            return response
    else:
        # on a GET send a clean form 
        form = WhisperForm()

    return render(request, 'whisper.html', {'form': form})

# rendering the main page with all the whispers 
def index(request):

    # get all the whisper objects 
    whispers = Whisper.objects.all()
    user_id = request.COOKIES.get('nonuserid')
    highlight_whisp = -1

    for whisp in whispers:

        whisp_id = str(whisp.created_by_user_id)

        if user_id == whisp_id:
            highlight_whisp = whisp.id

    return render(request, 'void.html', {'whisps': whispers, 'colorIndex': highlight_whisp})

def show_whispers(request):

    # get the id of the whisper from the url params 
    whisper_id = request.GET.get('whisper', '')
    # retrieve the whisper object 
    whisper_obj = Whisper.objects.get(intentification_num=whisper_id)

    interps = whisper_obj.interpretations.all()

    return render(request, 'whisper-chain.html', {'interps': interps, 'whisp': whisper_obj})







