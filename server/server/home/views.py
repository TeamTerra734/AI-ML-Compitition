from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.contrib.auth.models import User
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import pyrebase
from .GeminiModel.getimageinfo import getsatelliteimageinfo
from django.http import JsonResponse
import os
from datetime import datetime
import json
import requests
from PIL import Image
from io import BytesIO
from django.contrib.auth.decorators import login_required
import numpy as np
import base64
from firebase_admin import auth
import logging
from .ml_models import load_models, generelizePredict,generelizePredict_without_iot , satelite_image_classification
from keras._tf_keras.keras.preprocessing import image
from django.conf import settings
# Define the path to the model file
TF_ENABLE_ONEDNN_OPTS=0

# Firebase configuration
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Firebase configuration
FIREBASE_API_KEY = os.getenv('FIREBASE_API_KEY')
FIREBASE_AUTH_DOMAIN = os.getenv('FIREBASE_AUTH_DOMAIN')
FIREBASE_DATABASE_URL = os.getenv('FIREBASE_DATABASE_URL')
FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID')
FIREBASE_STORAGE_BUCKET = os.getenv('FIREBASE_STORAGE_BUCKET')
FIREBASE_MESSAGING_SENDER_ID = os.getenv('FIREBASE_MESSAGING_SENDER_ID')
FIREBASE_APP_ID = os.getenv('FIREBASE_APP_ID')
FIREBASE_MEASUREMENT_ID = os.getenv('FIREBASE_MEASUREMENT_ID')

# Firebase configuration dictionary
config = {
    "apiKey": FIREBASE_API_KEY,
    "authDomain": FIREBASE_AUTH_DOMAIN,
    "databaseURL": FIREBASE_DATABASE_URL,
    "projectId": FIREBASE_PROJECT_ID,
    "storageBucket": FIREBASE_STORAGE_BUCKET,
    "messagingSenderId": FIREBASE_MESSAGING_SENDER_ID,
    "appId": FIREBASE_APP_ID,
    "measurementId": FIREBASE_MEASUREMENT_ID
}

# Initialize Pyrebase


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_KEY_PATH = os.path.join(BASE_DIR,'geneco-e48a0-firebase-adminsdk-b8171-016266d9c6[1].json')


# Initialize Firebase Admin SDK
cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
firebase_admin.initialize_app(cred)

firebase = pyrebase.initialize_app(config)
authe = firebase.auth()

storage = firebase.storage()
database = firebase.database()


logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK


# Views
@login_required
def index(request):
    return render(request, 'index.html')


@csrf_exempt
def start_session(request):
    if request.method == 'POST':
        try:
            # Parse the request body for idToken and email
            body = json.loads(request.body)
            id_token = body.get('idToken')
            
            # Verify the ID Token with Firebase Admin SDK
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            email = decoded_token['email']
            # Print or log the UID to verify
            print("UID:", uid)
            print("email", email)
            # Handle user session or authentication
            request.session['uid'] = uid
            decoded_token.get('email')

            response_data = {
                'message': 'Session started successfully',
                'uid': uid,
                'email': email  # Return the email address if available
            }

            return JsonResponse(response_data)
        except auth.InvalidIdTokenError as e:
            logger.error("Invalid ID token: %s", e)
            return JsonResponse({'error': 'Invalid ID token'}, status=401)
        except Exception as e:
            logger.error("Error verifying ID token: %s", e)
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    




def predict_deforestation_pollution(model, img, img_size=(224, 224)):
    # Load and preprocess image
    
    # Ensure the image is in RGB mode
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize the image
    img = img.resize(img_size)
    
    # Convert image to numpy array
    x = image.img_to_array(img)
    
    # Expand dimensions to match the input shape of the model
    x = np.expand_dims(x, axis=0)
    
    # Normalize pixel values
    x = x / 255.0
    
    # Ensure the array is of type float32
    x = x.astype('float32')
    
    # Make a prediction using the model
    preds = model.predict(x)

    return preds

def pre(model, img, img_size=(224, 224)):
    # Load and preprocess image
    
    # Ensure the image is in RGB mode
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize the image
    img = img.resize(img_size)
    
    # Convert image to numpy array
    x = image.img_to_array(img)
    
    # Expand dimensions to match the input shape of the model
    x = np.expand_dims(x, axis=0)
    
    # Normalize pixel values
    x = x / 255.0
    
    # Ensure the array is of type float32
    x = x.astype('float32')
    
    # Make a prediction using the model
    preds = model.predict(x)

    return preds


@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
            image = request.FILES.get('image')
            img = Image.open(image)
            print(predict_deforestation_pollution(model,img),"prediction")

            title = request.POST.get('title')
            description = request.POST.get('description')
                
            # Save the image file
           
            
            # Process additional data if needed
            print(f'Title: {image}')

            print(f'Title: {title}')
            print(f'Description: {description}')
            
            return JsonResponse({'status': 'success', 'message': 'Image and data uploaded successfully'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)




# Load models at the start
model, satellite_image_model, iot_pipe,iot_model = load_models()



def download_image(url, user_email):
    response = requests.get(url)
    if response.status_code == 200:
        # Generate a unique name for the image using a timestamp
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        image_extension = url.split('.')[-1].split('?')[0]
        image_name = f"{timestamp}.{image_extension}"
        local_image_path = os.path.join(BASE_DIR, 'downloaded_images', user_email, image_name)

        # Create directory if not exists
        os.makedirs(os.path.dirname(local_image_path), exist_ok=True)

        with open(local_image_path, 'wb') as f:
            f.write(response.content)
        
        return local_image_path
    else:
        raise Exception(f"Failed to download image. Status code: {response.status_code}")  




@csrf_exempt
def upload_singular_data(request):
    if request.method == 'POST':
        try:
            user_email = request.session.get('email')
            user_id = request.session.session_key
            print(user_email)
            # Handle image upload
            if 'file' in request.FILES:
                print("done 1")
                image_data = request.FILES['file']
                image = Image.open(image_data)
                Image.open(image_data)
                
               # Generate a unique name for the image using a timestamp
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

                image_extension = image_data.name.split('.')[-1]
                print(image_extension)
                image_name = f"{timestamp}.jpeg"
                image_path = f"images/{user_id}/{image_name}"

                print("img1")
                # image_name = f"{timestamp}.jpg"
                # image_path = f"images/{user_email}/{image_name}"
                print("img2")
                # Save image to Firebase Storage
                storage.child(image_path).put(image_data)
                print("img3")
                # Get image URL
                image_url = storage.child(image_path).get_url(None)
            else:
                return JsonResponse({'error': 'Image not provided'}, status=400)
            
           # Parse the incoming data
            print("done 2")
            date = request.POST.get('date')
            location = request.POST.get('location')
            AQI = int(0 if request.POST.get('AQI')=='' or request.POST.get('AQI')==None else request.POST.get('AQI') )
            PM25= int(0 if request.POST.get('PM25')==''or request.POST.get('PM25')==None else request.POST.get('PM25') )
            PM10 = int(0 if request.POST.get('PM10')=='' or request.POST.get('PM10')==None else request.POST.get('PM10') )
            O3 = int(0 if request.POST.get('O3')==''or request.POST.get('O3')==None else request.POST.get('O3') )
            CO = int(0 if request.POST.get('CO')==''or request.POST.get('CO')==None else request.POST.get('CO') )
            SO2 = int(0 if request.POST.get('SO2')==''or request.POST.get('SO2')==None else request.POST.get('SO2') )
            NO2 = int(0 if request.POST.get('NO2')==''or request.POST.get('NO2')==None else request.POST.get('NO2') )

           
            
            # Prepare data for Firebase Database
        
            # Prepare IoT data (not saved to Firebase)
            iot_data = {
                "AQI": AQI,
                "PM25": PM25,
                "PM10": PM10,
                "O3": O3,
                "CO": CO,
                "SO2": SO2,
                "NO2": NO2,
            }
            print(iot_data)
            #prediction
            pred = predict_deforestation_pollution(model ,image)
            deforestation_prob = pred[0][0]
            pollution_prob = pred[0][1]
            classified = satelite_image_classification(satellite_image_model ,image)
            iot_predict = generelizePredict(iot_pipe,iot_model,AQI,PM25,PM10,O3,CO,SO2,NO2)

            print(deforestation_prob)
            
             # Download the image from URL
            

            db_data = {
                "user_email" : user_email,
                "user_id": user_id,
                "date": date,
                "location": location,
                "file": image_url,
                "AQI": AQI,
                "PM25": PM25,
                "PM10": PM10,
                "O3": O3,
                "CO": CO,
                "SO2": SO2,
                "NO2": NO2,
                "deforestationProbability" : float(deforestation_prob) if isinstance(deforestation_prob, np.float32) else deforestation_prob,
                "airPollutionProbability" : float(pollution_prob) if isinstance(pollution_prob, np.float32) else pollution_prob,
                "areaClassification" : classified,
                "airQualityClassification" : iot_predict,
            }
             # Save to Firebase Database
            database.child("user_images").push(db_data)
            
            # Log IoT data for debugging
            print(f"IoT Data: {iot_data}")

            return JsonResponse({'message': 'Image uploaded successfully!'}, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def upload_insightscan_data(request):
    if request.method == 'POST':
        try:
            user_email = request.session.get('email')
            user_id = request.session.session_key
            print(user_email)
            
            image = request.FILES.get('image')
            image_data = Image.open(image)

            title = request.POST.get('title')
            description = request.POST.get('description')
            if image_data:
                # Decode the base64-encoded image
                format, imgstr = image_data.split(';base64,') 
                ext = format.split('/')[-1]
                image = base64.b64decode(imgstr)
                
                # Generate a unique name for the image using a timestamp
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                image_name = f"{timestamp}.{ext}"
                image_path = f"images/{user_id}/{image_name}"

                # Save image to Firebase Storage
                storage.child(image_path).put(image)

                # Get image URL
                image_url = storage.child(image_path).get_url(None)
            else:
                return JsonResponse({'error': 'Image not provided'}, status=400)
            
            # Extract other data from JSON
            date = request.POST.get('date')
            location = request.POST.get('location')
            AQI = request.POST.get('AQI')
            PM25 = request.POST.get('PM25')
            PM10 = request.POST.get('PM10')
            O3 = request.POST.get('O3')
            CO = request.POST.get('CO')
            SO2 = request.POST.get('SO2')
            NO2 = request.POST.get('NO2')
            deforestationProbability = request.POST.get('deforestationProbability')
            airPollutionProbability = request.POST.get('airPollutionProbability')
            areaClassification = request.POST.get('areaClassification')
            airQualityClassification = request.POST.get('airQualityClassification')

            # Prepare data for Firebase Database
            db_data = {
                "user_email": user_email,
                "user_id": user_id,
                "date": date,
                "location": location,
                "file": image_url,
                "AQI": AQI,
                "PM25": PM25,
                "PM10": PM10,
                "O3": O3,
                "CO": CO,
                "SO2": SO2,
                "NO2": NO2,
                "deforestationProbability": deforestationProbability,
                "airPollutionProbability": airPollutionProbability,
                "areaClassification": areaClassification,
                "airQualityClassification": airQualityClassification,
            }

            # Save to Firebase Database
            database.child("user_images").push(db_data)

            # Log IoT data for debugging
            iot_data = {
                "AQI": AQI,
                "PM25": PM25,
                "PM10": PM10,
                "O3": O3,
                "CO": CO,
                "SO2": SO2,
                "NO2": NO2,
            }
            print(f"IoT Data: {iot_data}")

            return JsonResponse({'message': 'Image uploaded successfully!'}, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)






def handle_uploaded_file(f):
    # Define the directory where you want to save the uploaded files
    upload_dir = os.path.join(BASE_DIR, 'uploaded_images')
    
    # Create the directory if it does not exist
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Define the path where the file will be saved
    file_path = os.path.join(upload_dir, 'uploaded_image.jpg')  # Adjust the file name or extension as needed
    
    # Save the file to the defined path
    with open(file_path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)
    
    return file_path


from .GeminiModel import getimageinfo

@csrf_exempt
def insight_scan_prediction(request):
    # Initialize img_path to ensure it has a value in the finally block
    
    if request.method == 'POST':
        try:
            print("Request body:", request.body)
            print("Request POST data:", request.POST)
            print("Request FILES data:", request.FILES)

            user_email = request.session.get('email')
            user_id = request.session.session_key
            print(user_email)
            date = request.POST.get('date')
            location = request.POST.get('location')
            image_data = request.FILES.get('file')
            image = Image.open(image_data)
            

            # Get and log the other parameters
            AQI = int(request.POST.get('AQI', 0))
            PM25 = int(request.POST.get('PM25', 0))
            PM10 = int(request.POST.get('PM10', 0))
            O3 = int(request.POST.get('O3', 0))
            CO = int(request.POST.get('CO', 0))
            SO2 = int(request.POST.get('SO2', 0))
            NO2 = int(request.POST.get('NO2', 0))

            print(f"AQI: {AQI}")
            print(f"PM25: {PM25}")
            print(f"PM10: {PM10}")
            print(f"O3: {O3}")
            print(f"CO: {CO}")
            print(f"SO2: {SO2}")
            print(f"NO2: {NO2}")

            # local_image_path = download_image(image_url, user_email)

            # deforestation_prob, pollution_prob, classified, iot_predict = generelizePredict(
            #     model, satellite_image_model, iot_pipe, iot_model, local_image_path, AQI, PM25, PM10, O3, CO, SO2, NO2)
            pred = predict_deforestation_pollution(model ,image)
            deforestation_prob = pred[0][0]
            pollution_prob = pred[0][1]
            classified = satelite_image_classification(satellite_image_model ,image)
            iot_predict = generelizePredict(iot_pipe,iot_model,AQI,PM25,PM10,O3,CO,SO2,NO2)

            # # Ensure models are not None
            # if model is None :
            #     print("one")
            # if satellite_image_model is None:
            #     print("Two")
            # if iot_model is None:
            #     print("Three")

            # Call your prediction function

            # deforestation_prob, pollution_prob, classified, iot_predict = generelizePredict(
                # model, satellite_image_model, iot_pipe, iot_model, local_image_path, AQI, PM25, PM10, O3, CO, SO2, NO2)
            output = {
                "deforestationProbability": float(deforestation_prob) if isinstance(deforestation_prob, np.float32) else deforestation_prob,
                "airPollutionProbability": float(pollution_prob) if isinstance(pollution_prob, np.float32) else pollution_prob,
                "areaClassification": classified,
                "airQualityClassification": iot_predict,
            }
            
            prompt = f'''
            You are an expert meteorologist. Based on the following data: Deforestation Probability is {deforestation_prob}, Pollution Probability is {pollution_prob}, Classified as: {classified}", Air Quality: {iot_predict}, location: {location}. Make a good summary of it and suggest any actionable steps to take for environment conservation. Give the results in the form of a JSON object like this:
            {{
            "summary": "",
            "actions": ["action1", "action2"]
            }}
            Don't add any other text before or after the JSON, only JSON.
            '''
            result_geminimodel = getsatelliteimageinfo(prompt)

            
            try:
                result_dict = json.loads(result_geminimodel)
                summary = result_dict.get("summary", "")
                actions = result_dict.get("actions", [])
                
                output['summary'] = summary
                output['actions'] = actions

                return JsonResponse({'data': output}, status=200)
            
            except json.JSONDecodeError as e:
                return JsonResponse({'error': 'Failed to parse JSON response', 'details': str(e)}, status=500)

        except Exception as e:
            print(f"Error in insight_scan_prediction: {e}")
            return JsonResponse({'error': str(e)}, status=500)
        
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)






@csrf_exempt
def upload_excel_data(request):
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body)
            print(data)
            # if not isinstance(data, list):
            #     return JsonResponse({'error': 'Expected an array of objects'}, status=400)

            results = []

            for item in data:
                # user_email = request.session.get('email')
                image_link = item.get('link')
                location = item.get('location')
                date = item.get('date', None)

                #if not user_email or not image_link or not location:
                 #   return JsonResponse({'error': 'Missing required field(s) in one of the objects'}, status=400)

                # Fetch and process image
                response = requests.get(image_link)
                if response.status_code == 200:
                    image = Image.open(response)
                    pred = predict_deforestation_pollution(model ,image)
                    deforestation_prob = pred[0][0]
                    pollution_prob = pred[0][1]
                    classified = satelite_image_classification(satellite_image_model ,image)
                    


                    # Prepare data for Firebase Database
                    db_data = {
                        # "user_email" : user_email,
                        "date": date,
                        "location": location,
                        "file": image_link,
                        "deforestationProbability" : float(deforestation_prob) if isinstance(deforestation_prob, np.float32) else deforestation_prob,
                        "airPollutionProbability" : float(pollution_prob) if isinstance(pollution_prob, np.float32) else pollution_prob,
                        "areaClassification" : classified,
                        
                    }

                    # Save to Firebase Database
                    database.child("user_images").push(db_data)

                    results.append(db_data)
                else:
                    return JsonResponse({'error': f'Failed to fetch image from {image_link}'}, status=400)

            return JsonResponse({'message': 'Images processed and results saved successfully!', 'results': results}, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)




@csrf_exempt
def get_satellite_date(request):
    # GET /get_user_data?user_id=12345
    if request.method == 'GET':
        try:
            # user_id = request.GET.get('user_id')
            # if not user_id:
            #     return JsonResponse({'error': 'User ID not provided'}, status=400)
            user_id="bhavikrohit22@gmail.com"
            print("done1")
           
            # Retrieve data from Firebase Database
            user_data_ref = database.child("user_images").order_by_child(
                "user_email").equal_to(user_id).get()
            print("done2")
            

            user_data_list = []
            if user_data_ref:
                user_data_list = [item.val() for item in user_data_ref.each()]
            print("done3")
            

            return JsonResponse({'data': user_data_list}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)