from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
from ultralytics import YOLO
import base64
import math

app = Flask(__name__)
CORS(app)

classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
              "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
              "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
              "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
              "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
              "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
              "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
              "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
              "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
              "teddy bear", "hair drier", "toothbrush"
              ]

# Load your YOLO model
model = YOLO("yolo-Weights/yolov8n.pt")

@app.route('/detect_objects_in_frame', methods=['POST'])
def detect_objects_in_frame():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Invalid request"}), 400

    # Decode the image from base64 and prepare it
    encoded_data = data['image']
    if encoded_data.startswith('data:image/jpeg;base64,'):
        encoded_data = encoded_data.replace('data:image/jpeg;base64,', '')
    decoded_data = base64.b64decode(encoded_data)
    nparr = np.frombuffer(decoded_data, np.uint8)

    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    
    results = model(img)
    
    # Process results
    detections = []
    for r in results:
        boxes = r.boxes

        for box in boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            x1, y1, x2, y2 = [int(coord) for coord in box.xyxy[0]]

            detection = {
                "class_name": classNames[class_id],
                "confidence": round(confidence, 2),
                "bbox": [x1, y1, x2, y2]
            }
            detections.append(detection)

    return jsonify(detections)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
