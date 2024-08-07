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
from .ml_models import load_models, generelizePredict , satelite_image_classification , predict_deforestation_pollution 
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

new_prob_array = None 
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
            request.session['email'] = email

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
    




# def predict_deforestation_pollution(model, img, img_size=(224, 224)):
#     # Load and preprocess image
    
#     # Ensure the image is in RGB mode
#     if img.mode != 'RGB':
#         img = img.convert('RGB')
    
#     # Resize the image
#     img = img.resize(img_size)
    
#     # Convert image to numpy array
#     x = image.img_to_array(img)
    
#     # Expand dimensions to match the input shape of the model
#     x = np.expand_dims(x, axis=0)
    
#     # Normalize pixel values
#     x = x / 255.0
    
#     # Ensure the array is of type float32
#     x = x.astype('float32')
    
#     # Make a prediction using the model
#     preds = model.predict(x)

#     return preds

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
            print(predict_deforestation_pollution(deforestation_model,img),"prediction")

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
deforestation_model, satellite_image_model, iot_pipe,iot_model = load_models()



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


import io
@csrf_exempt
def upload_singular_data(request):
    if request.method == 'POST':
        try:
            id_token=request.POST.get('idToken')
            decoded_token = auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            user_email = decoded_token.get('email')
            print(id_token,"id token")
            print("uemail")
            print(request.FILES,"files")
            # Handle image upload
            if 'file' in request.FILES:
                print("done 1")
                image_data = request.FILES['file']

                # Print file information for debugging
                print(f"File name: {image_data.name}")
                print(f"File size: {image_data.size}")
                print(f"File content type: {image_data.content_type}")

                # Generate a unique name for the image using a timestamp
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                image_extension = image_data.name.split('.')[-1]
                print(image_extension)
                image_name = f"{timestamp}.{image_extension}"
                image_path = f"images/{user_email}/{image_name}"

                print("img1")

                # Save image to Firebase Storage
                storage.child(image_path).put(image_data, image_data.content_type)
                print("img3")

                # Get image URL
                image_url = storage.child(image_path).get_url(None)
                print(f"Image URL: {image_url}")

                # Open the image for processing
                image_data.seek(0)


            else:
                return JsonResponse({'error': 'Image not provided'}, status=400)

            print("done 2")
            date = request.POST.get('date')
            location = request.POST.get('location')
            AQI = int(0 if request.POST.get('AQI') == '' or request.POST.get('AQI') is None else request.POST.get('AQI'))
            PM25 = int(0 if request.POST.get('PM25') == '' or request.POST.get('PM25') is None else request.POST.get('PM25'))
            PM10 = int(0 if request.POST.get('PM10') == '' or request.POST.get('PM10') is None else request.POST.get('PM10'))
            O3 = int(0 if request.POST.get('O3') == '' or request.POST.get('O3') is None else request.POST.get('O3'))
            CO = int(0 if request.POST.get('CO') == '' or request.POST.get('CO') is None else request.POST.get('CO'))
            SO2 = int(0 if request.POST.get('SO2') == '' or request.POST.get('SO2') is None else request.POST.get('SO2'))
            NO2 = int(0 if request.POST.get('NO2') == '' or request.POST.get('NO2') is None else request.POST.get('NO2'))

            # Prepare data for Firebase Database
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

            image_path = handle_uploaded_file(image_data)
            # deforestation_prob, pollution_prob, classified, iot_predict = generelizePredict(
            #     model, satellite_image_model, iot_pipe, iot_model, local_image_path, AQI, PM25, PM10, O3, CO, SO2, NO2)
            prob_array = predict_deforestation_pollution(deforestation_model ,image_path)
            classified = satelite_image_classification(satellite_image_model ,image_path)
            iot_predict = generelizePredict(iot_pipe, iot_model, AQI, PM25, PM10, O3, CO, SO2, NO2)

            #sending the prob_array to make 2d array insted of numpy array
            prob_array = map_top_probabilities(prob_array)
            
            print(prob_array)

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
                "prob_array" :prob_array,
                "areaClassification": classified,
                "airQualityClassification": iot_predict,
            }
            
            # Save to Firebase Database
            database.child("user_images").push(db_data)
            print(db_data)
            # Log IoT data for debugging
            print(f"IoT Data: {iot_data}")

            return JsonResponse({'message': 'Image uploaded successfully!', 'image_url': image_url}, status=201)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=401)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=402)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)  
@csrf_exempt
def upload_insightscan_data(request):
    if request.method == 'POST':
        try:
            id_token=request.POST.get('idToken')
            decoded_token = auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            user_email = decoded_token.get('email')

            # Handle image upload
            
            print("File received in request")
            image_data = request.FILES.get('file')
            print("ahi")
            # # Print file information for debugging
            # print(f"File name: {image_data.name}")
            # print(f"File size: {image_data.size}")
            # print(f"File content type: {image_data.content_type}")

            # Generate a unique name for the image using a timestamp
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            image_extension = image_data.name.split('.')[-1]
            image_name = f"{timestamp}.{image_extension}"
            image_path = f"images/{user_email}/{image_name}"

            print(f"Image path: {image_path}")

            # Save image to Firebase Storage
            storage.child(image_path).put(image_data, image_data.content_type)
            print("Image uploaded to Firebase Storage")

            # Get image URL
            image_url = storage.child(image_path).get_url(None)
            print(f"Image URL: {image_url}")

            # Open the image for processing
            image_data.seek(0)
            image = Image.open(io.BytesIO(image_data.read()))
            # #

            # Extract other data from JSON
            date = request.POST.get('date')
            location = request.POST.get('location')
            AQI = int(0 if request.POST.get('AQI') == '' or request.POST.get('AQI') is None else request.POST.get('AQI'))
            PM25 = int(0 if request.POST.get('PM25') == '' or request.POST.get('PM25') is None else request.POST.get('PM25'))
            PM10 = int(0 if request.POST.get('PM10') == '' or request.POST.get('PM10') is None else request.POST.get('PM10'))
            O3 = int(0 if request.POST.get('O3') == '' or request.POST.get('O3') is None else request.POST.get('O3'))
            CO = int(0 if request.POST.get('CO') == '' or request.POST.get('CO') is None else request.POST.get('CO'))
            SO2 = int(0 if request.POST.get('SO2') == '' or request.POST.get('SO2') is None else request.POST.get('SO2'))
            NO2 = int(0 if request.POST.get('NO2') == '' or request.POST.get('NO2') is None else request.POST.get('NO2'))
            prob_array = request.POST.get('prob_array')
            prob_array = convert_to_array_of_arrays(prob_array) 
            print(prob_array)
            print(type(prob_array))
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
                "prob_array": prob_array,
                "areaClassification": areaClassification,
                "airQualityClassification": airQualityClassification,
            }

            # Save to Firebase Database
            database.child("user_images").push(db_data)
            print("saved successfully")
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

            return JsonResponse({'message': 'Image uploaded successfully!'}, status=200)
        except KeyError as e:
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)

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
            # print("Request body:", request.body)
            # print("Request POST data:", request.POST)
            # print("Request FILES data:", request.FILES)

            user_email = request.session.get('email')
            user_id = request.session.session_key
            print(user_email)
            date = request.POST.get('date')
            location = request.POST.get('location')
            image_data = request.FILES.get('file')
            gemini_image = Image.open(image_data)
            # image = np.array(gemini_image)

            # Get and log the other parameters
            AQI = int(request.POST.get('AQI', 0))
            PM2_5 = int(request.POST.get('PM2_5', 0))
            PM10 = int(request.POST.get('PM10', 0))
            O3 = int(request.POST.get('O3', 0))
            CO = int(request.POST.get('CO', 0))
            SO2 = int(request.POST.get('SO2', 0))
            NO2 = int(request.POST.get('NO2', 0))

            print(f"AQI: {AQI}")
            print(f"PM25: {PM2_5}")
            print(f"PM10: {PM10}")
            print(f"O3: {O3}")
            print(f"CO: {CO}")
            print(f"SO2: {SO2}")
            print(f"NO2: {NO2}")


            # local_image_path = download_image(image_url, user_email)
            
            image_path = handle_uploaded_file(image_data)
            # deforestation_prob, pollution_prob, classified, iot_predict = generelizePredict(
            #     model, satellite_image_model, iot_pipe, iot_model, local_image_path, AQI, PM25, PM10, O3, CO, SO2, NO2)
            prob_array = predict_deforestation_pollution(deforestation_model ,image_path)
            classified = satelite_image_classification(satellite_image_model ,image_path)
            iot_predict = generelizePredict(iot_pipe,iot_model,AQI,PM2_5,PM10,O3,CO,SO2,NO2)
            print(prob_array)
            print(type(prob_array[0][0]))
            prob_array = map_top_probabilities(prob_array)
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
                "areaClassification": classified,
                "airQualityClassification": iot_predict,
            }   
            print(output)
            prompt = f'''
            You are an expert meteorologist. Given the image and Based on the following data: Deforestation Probability is {prob_array}, Air Quality: {iot_predict}, location: {location}.Classify the image based on "cloudy","desert","water","green_area"and make a good summary of it also using the image and suggest any actionable steps to take for environment conservation. Give the results in the form of a JSON object like this:
            {{
            "summary": "",
            "actions": ["action1", "action2"],
            }}
            Don't add any other text before or after the JSON, only JSON.
            '''

            result_geminimodel = getsatelliteimageinfo(prompt,gemini_image)

            try:
                result_dict = json.loads(result_geminimodel)
                #areaClassification = result_dict.get("areaClassification", "")
                summary = result_dict.get("summary", "")
                actions = result_dict.get("actions", [])
                
                output['summary'] = summary
                output['actions'] = actions
                output['prob_array'] = prob_array
                #output['areaClassification'] = areaClassification
                print(output)
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
            # Parse JSON data from the request body
            data_list = json.loads(request.body)
            

            if not data_list:
                logger.error("No data provided")
                return JsonResponse({'error': 'No data provided'}, status=400)

            for data in data_list:
                date = data.get('date')
                location = data.get('location')
                image_link = data.get('link')
                O3 = data.get('O3')
                CO = data.get('CO')
                CO = data.get('CO')
                NO2 = data.get('NO2')
                SO2 = data.get('SO2')
                AQI = data.get('AQI')
                PM2_5 = data.get('PM2_5')
                PM10 = data.get('PM10')
                id_token = data.get('idToken')
                
                
                # Verify the ID Token with Firebase Admin SDK
                decoded_token = auth.verify_id_token(id_token)
                uid = decoded_token['uid']
                email = decoded_token['email']
                print("hiiii")
                print(email)


                logger.debug(f"Received data: {data_list}")
                # Download the image from the URL
                response = requests.get(image_link)
                if response.status_code == 200:
                    image_data = BytesIO(response.content)
                    try:
                        image = Image.open(image_data)
                        image.verify()  # Verify the image
                        image_path = handle_uploaded_file(image_data)
        
                        prob_array = predict_deforestation_pollution(deforestation_model ,image_path)
                        classified = satelite_image_classification(satellite_image_model ,image_path)
                            
                    except (IOError, SyntaxError) as e:
                        logger.error(f"Invalid image: {e}")
                        return JsonResponse({'error': 'Invalid image'}, status=400)
                else:
                    logger.error("Failed to download image")
                    return JsonResponse({'error': 'Failed to download image'}, status=400)

                # Prepare data for Firebase Database
                db_data = {
                    "user_email":email,
                    "user_id": uid,
                    "date": date,
                    "location": location,
                    "file":image_link,
                    "areaClassification": classified,
                    "prob_array":prob_array,
                    "O3":O3 if O3 else -1,
                    "CO":CO if CO else -1,
                    "NO2":NO2 if NO2 else -1,
                    "SO2":SO2 if SO2 else -1,
                    "AQI":AQI if AQI else -1,
                    "PM2_5":PM2_5 if PM2_5 else -1,
                    "PM10":PM10 if PM10 else -1,
                }
                print(db_data)

                # Save to Firebase Database
                database.child("user_images").push(db_data)

            logger.debug("Data uploaded successfully")
            return JsonResponse({'message': 'Data uploaded successfully!'}, status=201)
        except KeyError as e:
            logger.error(f"Missing required field: {str(e)}")
            return JsonResponse({'error': f'Missing required field: {str(e)}'}, status=400)
        except json.JSONDecodeError:
            logger.error("Invalid JSON")
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
    else:
        logger.error("Invalid request method")
        return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
def get_satellite_date(request):
    # GET /get_user_data?user_id=12345
    if request.method == 'GET':
        try:
            # user_id = request.GET.get('user_id')
            id_token=request.GET.get('user_id')
            decoded_token=auth.verify_id_token(id_token)
            email=decoded_token.get('email')
            print(email)
            if not email:
                return JsonResponse({'error': 'User ID not provided'}, status=400)
            print("done1")
           
            # Retrieve data from Firebase Database
            user_data_ref = database.child("user_images").order_by_child(
                "user_email").equal_to(email).get()
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
    

def map_top_probabilities(prob_array ):
    names = ['agriculture', 'artisinal_mine', 'bare_ground', 'blow_down', 
             'conventional_mine', 'habitation', 'selective_logging', 'slash_burn']

    row = prob_array[0]

        # Convert probabilities to Python float
    row = row.astype(float)
    
    # Get the indices of the top 3 probabilities
    top_indices = np.argsort(row)[::-1]
    # Map the probabilities to their corresponding names
    top_probabilities = [[round(row[i] , 4), names[i]] for i in top_indices]

    return top_probabilities

def convert_to_array_of_arrays(prob_string):
    # Split the string into elements based on commas
    elements = prob_string.split(',')
    
    # Create an empty list to store the result
    result = []
    
    # Iterate through the elements in pairs
    for i in range(0, len(elements), 2):
        # Extract the probability and the category
        probability = float(elements[i])
        category = elements[i+1]
        
        # Create an array with the probability and category
        entry = [probability, category]
        
        # Add the array to the result list
        result.append(entry)
    
    return result


