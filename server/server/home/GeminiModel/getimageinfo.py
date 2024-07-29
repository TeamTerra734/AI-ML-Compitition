import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image
import io

def getsatelliteimageinfo(prompt):
    # Load environment variables if needed
    load_dotenv()

    # Configure the generative AI model
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    generation_config = {
        "temperature": 0.6,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
    )

    # Load and process the image from the file-like object


    # Generate content based on the combined prompt
    prompt_text = "You are an expert meteorologist. Describe the details of the satellite image. Give information about deforestation, air quality, and types of clouds if visible, and also the environment."
    response = model.generate_content(prompt)
    
    # Extract the generated text from the response
    res = response.text
    print(res)
    return res

# Example usage
# This function can now be called with an image file object received from the frontend.