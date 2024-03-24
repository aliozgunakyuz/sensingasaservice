from flask import Flask, request, jsonify
import cv2
import requests
import base64
from pathlib import Path
import numpy as np
import os
import time  # Added to use the sleep function

app = Flask(__name__)

# Assuming CORS is needed for your setup
from flask_cors import CORS
CORS(app)

video_dir = "/app/videos"

# Assuming you're using this URL, ensure the hostname and port are correct for your setup
yolo_api_url = "http://sensingService:5001/detect_objects_in_frame"

def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')  # Decode bytes to string for JSON compatibility

def send_frame_to_yolo(frame_base64):
    try:
        response = requests.post(yolo_api_url, json={"image": frame_base64})
        response.raise_for_status()  # Check for HTTP errors
        return response.json()
    except requests.exceptions.HTTPError as err:
        print(f"HTTP Error: {err}")
    except ValueError as e:  # Includes JSONDecodeError
        print(f"Error decoding JSON: {e}")
        print(f"Response content: {response.text}")
    return None

@app.route('/process_video', methods=['POST'])
def process_video_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded video file temporarily
    temp_path = os.path.join(video_dir, file.filename)
    file.save(temp_path)

    # Process the video
    results = process_video(temp_path)

    return jsonify(results)

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)  # Frames per second
    frame_interval = int(max(1, fps * 5))  # Calculate the interval for 5 seconds, ensure at least 1
    frame_count = 0
    results = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            frame_base64 = encode_frame_to_base64(frame)
            yolo_response = send_frame_to_yolo(frame_base64)
            if yolo_response is not None:  # Check if the response is valid
                results.append({"frame": frame_count, "response": yolo_response})
            time.sleep(5)  # Wait for 5 seconds before processing the next frame
        
        frame_count += 1

    cap.release()
    return results

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
