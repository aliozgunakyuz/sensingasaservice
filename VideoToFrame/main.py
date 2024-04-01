from flask import Flask, request, jsonify
import cv2
import requests
import base64
from pathlib import Path
import numpy as np
import os

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

video_dir = "/app/videos"
yolo_api_url = "http://sensingService:5001/detect_objects_in_frame"

def encode_frame_to_base64(frame):
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')

def send_frame_to_yolo(frame_base64):
    try:
        response = requests.post(yolo_api_url, json={"image": frame_base64})
        response.raise_for_status()
        print(response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request to YOLO service failed: {e}")
        return None

@app.route('/process_video', methods=['POST'])
def process_video_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    temp_path = os.path.join(video_dir, file.filename)
    file.save(temp_path)
    results = process_video(temp_path)

    return jsonify(results)

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = max(1, int(fps * 5))
    frame_count = 0
    results = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            frame_base64 = encode_frame_to_base64(frame)
            yolo_response = send_frame_to_yolo(frame_base64)
            if yolo_response:
                results.append({"frame": frame_count, "response": yolo_response})

        frame_count += 1

    cap.release()
    return {"results": results}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
