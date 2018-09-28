from django import forms 

class InterpretationForm(forms.Form):
  interp = forms.CharField(label='whisper back', max_length=200)

class WhisperForm(forms.Form):
    whisper = forms.CharField(label='whisper something', max_length=200)