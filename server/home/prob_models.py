import os
import pickle
from tensorflow.keras.models import load_model
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Define the paths to your models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, 'home', 'prob_models', 'model.keras')
satellite_image_model_path = os.path.join(BASE_DIR, 'home', 'prob_models', 'satelite_image.keras')
iot_model_path = os.path.join(BASE_DIR, 'home', 'prob_models', 'iot.pkl')

def load_models():
    try:
        model = load_model(model_path)
        satellite_image_model = load_model(satellite_image_model_path)
        with open(iot_model_path, 'rb') as file:
            iot_model = pickle.load(file)
        print("Models loaded successfully.")
        return model, satellite_image_model, iot_model
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None, None

def predict_deforestation_pollution(model, img_path, img_size=(224, 224)):
    img = image.load_img(img_path, target_size=img_size)
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0
    preds = model.predict(x)
    return preds

def satellite_image_classification(model, img_path, img_size=(72, 128)):
    classes = {
        0: "cloudy",
        1: "desert",
        2: "water",
        3: "green_area"
    }
    sample_image = image.load_img(img_path, target_size=img_size)
    sample_image = image.img_to_array(sample_image)
    sample_image = tf.expand_dims(sample_image, axis=0)
    predictions = model.predict(sample_image)
    predicted_class_index = tf.argmax(predictions, axis=1).numpy()[0]
    predicted_class = classes[predicted_class_index]
    return predicted_class

def iot_data(model, AQI, PM25, PM10, O3, CO, SO2, NO2):
    X = np.array([AQI, PM25, PM10, O3, CO, SO2, NO2])
    aqi_dict = {
        0: 'Good',
        1: 'Moderate',
        2: 'Unhealthy_for_Sensitive_Groups',
        3: 'Unhealthy',
        4: 'Very_Unhealthy',
        5: 'Severe'
    }
    return aqi_dict[np.argmax(model.predict(X.reshape(1, -1)))]

def generelizePredict(model, satellite_model, iot_model, img_path, AQI=None, PM25=None, PM10=None, O3=None, CO=None, SO2=None, NO2=None):
    preds = predict_deforestation_pollution(model, img_path)
    deforestation_prob = preds[0][0]
    pollution_prob = preds[0][1]
    classified = satellite_image_classification(satellite_model, img_path, img_size=(72, 128))
    iot_predict = iot_data(iot_model, AQI, PM25, PM10, O3, CO, SO2, NO2)
    prompt_str = f"""Deforestation Probability is :{deforestation_prob} Pollution Probability is :{pollution_prob} Classified as :{classified} Air Quality: {iot_predict}"""
    return prompt_str
