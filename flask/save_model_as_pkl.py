import torch
import joblib

# Load the entire model from the .pth file
model = torch.load('./model.pth', map_location=torch.device('cpu'))
model.eval()  # Set the model to evaluation mode

# Save the model as a .pkl file using joblib
joblib.dump(model, 'model.pkl')
print("Model saved as model.pkl")