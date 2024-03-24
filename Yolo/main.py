from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
from ultralytics import YOLO
import base64

app = Flask(__name__)
CORS(app)

# Load your YOLO model
model = YOLO("yolo-Weights/yolov8n.pt")

@app.route('/detect_objects_in_frame', methods=['POST'])
def detect_objects_in_frame():
    # Decode the image from base64
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Invalid request"}), 400

    # Convert base64 image to numpy array
    encoded_data = data['image']
    nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Use YOLO model to detect objects
    results = model(img)

    # Extract detection results
    detections = format_detections(results)

    return jsonify(detections)

def format_detections(results):
    detections = []
    for *xyxy, conf, cls in results.xyxy[0]:  # results.xyxy is a list of tensors
        detection = {
            "class_name": results.names[int(cls)],
            "confidence": round(float(conf), 2),
            "bbox": [int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])]
        }
        detections.append(detection)
    return detections

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
