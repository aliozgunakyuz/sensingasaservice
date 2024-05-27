from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
import tensorflow as tf
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'  # This tells TensorFlow to use only CPU


app = Flask(__name__)
CORS(app)

# Define the emotion classes
emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Load your emotion detection model
model = tf.keras.models.load_model("emotion_model.h5")

@app.route('/detect_emotions_in_frame', methods=['POST'])
def detect_emotions_in_frame():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Invalid request"}), 400

    # Decode the image from base64 and prepare it
    encoded_data = data['image']
    if encoded_data.startswith('data:image/jpeg;base64,'):
        encoded_data = encoded_data.replace('data:image/jpeg;base64,', '')
    decoded_data = base64.b64decode(encoded_data)
    nparr = np.frombuffer(decoded_data, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, (48, 48))
    img = img / 255.0
    img = np.reshape(img, (1, 48, 48, 1))

    # Predict the emotion
    predictions = model.predict(img)
    max_index = int(np.argmax(predictions))
    emotion = emotion_labels[max_index]
    confidence = float(np.max(predictions))

    # Prepare the response
    response = {
        "emotion": emotion,
        "confidence": round(confidence, 2)
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
