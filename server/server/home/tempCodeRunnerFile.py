
from firebase_admin import credentials, auth as firebase_auth
import pyrebase
from .GeminiModel.getimageinfo import getsatelliteimageinfo
from django.http import JsonResponse
import os
from .forms import UserImageForm
import pyrebase
import json
# Firebase configuration
config = {
    "apiKey": "AIzaSyBsKZF8MRSBx7H1wuZEeJvDQuw7hZf7YT8",
    "authDomain": "ecogen-cedff.firebaseapp.com",
    "databaseURL": "https://ecogen-cedff-default-rtdb.asia-southeast1.firebasedatabase.app",
    "projectId": "ecogen-cedff",
    "storageBucket": "ecogen-cedff.appspot.com",
    "messagingSenderId": "210490353539",
    "appId": "1:210490353539:web:8e89fadfcd25ac9a3738b6",
    "measurementId": "G-923JTNM134"
}

# Initialize Pyrebase
firebase = pyrebase.initialize_app(config)
authe = firebase.auth()

storage = firebase.storage()
database = firebase.database()

# Initialize Firebase Admin SDK

# Views
def index(request):
    return render(request, 'index.html')

def signup(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password1')
        try:
            user = authe.create_user_with_email_and_password(email, password)
            return redirect('login')
        except Exception as e:
            message = f"Unable to create account: {str(e)}"
            return render(request, 'signup.html', {'message': message})
    return render(request, 'signup.html')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user = authe.sign_in_with_email_and_password(email, password)
            session_id = user['idToken']
            request.session['uid'] = str(session_id)
            return redirect('dashboard')
        except Exception as e:
            message = f"Invalid credentials: {str(e)}"
            return render(request, 'login.html', {'message': message})
    return render(request, 'login.html')

def dashboard(request):
    return render(request, 'dashboard.html')

def logout(request):
    request.session.flush()
    return redirect('login')

def google_signin(request):
    return render(request, 'google_signin.html')
# def google_signin(request):
#     return render(request, 'google_signin.html')




@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        image