from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import UserImage
# myapp/forms.py

class UserImageForm(forms.Form):
    user_id = forms.CharField(max_length=255)
    image = forms.ImageField()
    date = forms.DateField()
    location = forms.CharField(max_length=255)
    field1 = forms.CharField(max_length=255, required=False)
    field2 = forms.CharField(max_length=255, required=False)
    field3 = forms.CharField(max_length=255, required=False)
    field4 = forms.CharField(max_length=255, required=False)
    field5 = forms.CharField(max_length=255, required=False)

class UserRegForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super(UserRegForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Username'})
        self.fields['email'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Email'})
        self.fields['password1'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Password'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Confirm Password'})

class UserLoginForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))
