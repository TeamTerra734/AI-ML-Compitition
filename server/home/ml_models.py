import os
import pickle
from tensorflow.keras.models import load_model
import numpy as np
import tensorflow as tf
import keras
from tensorflow.keras.preprocessing import image
from tensorflow.keras.losses import SparseCategoricalCrossentropy
import pickle as pkl

TF_ENABLE_ONEDNN_OPTS=0

# Define the paths to your models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
deforestation_model_path = os.path.join(BASE_DIR, 'home', 'prob_models', 'Deforestation.h5')
satellite_image_model_path = os.path.join(BASE_DIR, 'home', 'prob_models', 'cnn_model_area.h5')
iot_model_pkl = os.path.join(BASE_DIR, 'home', 'prob_models', 'latest_iot.pkl')
iot_model_h5 = os.path.join(BASE_DIR, 'home', 'prob_models', 'latest_iot.h5')




def custom_loss_from_config(config):
    if config['class_name'] == 'SparseCategoricalCrossentropy':
        config['config'].pop('fn', None)  # Remove the 'fn' key if it exists
        return SparseCategoricalCrossentropy.from_config(config['config'])
    return keras.losses.get(config)



def load_models():
    try:
        # Log paths
        print(f"Base directory: {BASE_DIR}")
        print(f"Model path: {deforestation_model_path}")
        print(f"Satellite image model path: {satellite_image_model_path}")
        print(f"IoT model path: {iot_model_pkl}")

        # Check existence and load model
        if not os.path.exists(deforestation_model_path):
            print(f"Model file not found at {deforestation_model_path}")
            return None, None, None
        deforestaion_model = load_model(deforestation_model_path)
        print(f"Model loaded successfully from {deforestation_model_path}")

        # Check existence and load satellite image model
        

        satellite_image_model=load_model(satellite_image_model_path,custom_objects={'SparseCategoricalCrossentropy': custom_loss_from_config})
        print("satellite successfully loaded")

        model3_pipe=pkl.load(open(iot_model_pkl,"rb"))
        model3_keras=load_model(iot_model_h5)
        print("iot in the house")
        return deforestaion_model,satellite_image_model,model3_pipe, model3_keras
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None, None,None
    


def predict_deforestation_pollution(model, sample_image, img_size=(224, 224)):

    # Load and preprocess image
    
    # Ensure the image is in RGB mode

    if sample_image.mode != 'RGB':
        sample_image = sample_image.convert('RGB')
    sample_image = sample_image.resize((224,224))
    sample_image = image.img_to_array(sample_image)
    sample_image =np.expand_dims(sample_image,axis=0)
    sample_image = sample_image.astype('float32')
    
    # Make a prediction using the model
    preds = model.predict(sample_image)
    return preds


def satelite_image_classification(model, sample_image):
    classes = {
        0: "cloudy",
        1: "desert",
        2: "water",
        3: "green_area"
    }
    if sample_image.mode != 'RGB':
        sample_image = sample_image.convert('RGB')
    sample_image = sample_image.resize((224,224))
    sample_image = image.img_to_array(sample_image)
    sample_image =np.expand_dims(sample_image,axis=0)
    sample_image = sample_image.astype('float32')
    # Make a prediction using the model
    
    predictions = model.predict(sample_image)

    predicted_class_index = np.argmax(predictions)
    predicted_class = classes[predicted_class_index]

    return predicted_class

def iot_data(pipeline,model,AQI,PM25,	PM10,	O3,	CO,	SO2,	NO2):
    X=np.array([AQI,PM25,PM10,O3,CO,SO2,NO2])
    X=X.reshape(1,-1)
    X=pipeline.transform(X)

    aqi_dict = { 0:'Good' ,
             1:'Moderate'  ,
             2:'Unhealthy_for_Sensitive_Groups' ,
             3:'Unhealthy',
             4:'Very_Unhealthy'  ,
             5:'Severe' }
    return aqi_dict[np.argmax(model.predict(X.reshape(1,-1)))]

def generelizePredict(iot_pipeline,iot_model,AQI=None,PM25=None,	PM10=None,	O3=None,	CO=None,	SO2=None,	NO2=None):
    #preds=predict_deforestation_pollution(model, img_path)

    # deforestation_prob = preds[0][0]
    # pollution_prob = preds[0][1]

    #classified=satelite_image_classification(satelite_model,img_path,img_size=(72,128))

    iot_predict=iot_data(iot_pipeline,iot_model,AQI,PM25,	PM10,	O3,	CO,	SO2,	NO2)


    return iot_predict



def generelizePredict_without_iot(model,satelite_model,img_path):
    preds=predict_deforestation_pollution(model, img_path)

    deforestation_prob = preds[0][0]
    pollution_prob = preds[0][1]

    classified=satelite_image_classification(satelite_model,img_path,img_size=(72,128))

    


    return deforestation_prob,pollution_prob,classified



if __name__ == "__main__":
    model, satellite_image_model, iot_model = load_models()
    if model and satellite_image_model and iot_model:
        print("All models loaded successfully")
    else:
        print("Failed to load one or more models")

