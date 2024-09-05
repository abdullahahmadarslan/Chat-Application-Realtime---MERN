from flask import Flask, request, jsonify
import torch
import joblib
from torchvision import transforms
from PIL import Image
import os

app = Flask(__name__)

# Check if CUDA (GPU) is available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the model from the .pkl file
model = joblib.load('e:/chat app/flask/model.pkl')
model = model.to(device)  # Move the model to the GPU if available
model.eval()  # Set the model to evaluation mode

# Define the classes (same as used during training)
classes = ['drawings', 'hentai', 'neutral', 'porn', 'sexy']

# Define the image preprocessing function
def preprocess_image(image_path):
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    image = Image.open(image_path).convert('RGB')
    image = preprocess(image)
    image = image.unsqueeze(0)  # Add a batch dimension
    return image.to(device)  # Move the image tensor to the GPU if available

def predict_image(image_path):
    # Preprocess the image
    image = preprocess_image(image_path)

    # Perform the prediction
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)

    predicted_class = classes[predicted.item()]
    return predicted_class

def classify_image_safety(image_path):
    predicted_class = predict_image(image_path)
    return predicted_class == 'neutral'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        image_file = request.files['image']
        image_path = os.path.join('uploads', image_file.filename)
        image_file.save(image_path)

        is_safe = classify_image_safety(image_path)
        os.remove(image_path)

        return jsonify({'is_safe': is_safe}), 200
    except Exception as e:
        print(f"Error: {e}")  # Print error details to console
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    # Run the Flask server
    app.run(port=5001, debug=True)
    print("Flask server is running on http://localhost:5001")
    
