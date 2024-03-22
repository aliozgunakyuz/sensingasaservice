from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
from werkzeug.utils import secure_filename

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

# Specify the path to your YOLO weights
model = YOLO("yolo-Weights/yolov8n.pt")

UPLOAD_FOLDER = '/Users/ozgun/Desktop/sensingasaservice/Yolo/app/static/videos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # Now, use OpenCV to read the video
    cap = cv2.VideoCapture(filepath)
    
    if not cap.isOpened():
        return jsonify({"error": "Could not open video file"})

    fps = cap.get(cv2.CAP_PROP_FPS)
    skip_frames = max(int(fps), 1)  # Ensure at least one frame is processed

    video_detections = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break  # Reached the end of the video

        if frame_count % skip_frames == 0:  # Adjust based on actual FPS to get frames every 1000ms
            frame_detections = process_frame(frame)
            video_detections.append({"frame": frame_count, "detections": frame_detections})

        frame_count += 1

    cap.release()

    # Optionally, delete the file after processing if it's not needed
    # os.remove(filepath)

    return jsonify(video_detections)

def process_frame(img):
    results = model(img)
    detections = []

    # Directly access the bounding boxes, class names, and scores
    if hasattr(results, 'boxes'):
        boxes = results.boxes  # Assuming this contains bounding box information
        for i, box in enumerate(boxes):
            x1, y1, x2, y2 = [int(coord) for coord in box.xyxy]
            class_id = int(box.cls)  # Assuming 'cls' attribute contains class ID
            confidence = float(box.conf)  # Assuming 'conf' attribute contains confidence score

            detection = {
                "class_name": classNames[class_id],
                "confidence": round(confidence, 2),
                "bbox": [x1, y1, x2, y2]
            }
            detections.append(detection)
    else:
        # Fallback or error handling if 'boxes' attribute is not found
        print("No 'boxes' attribute found in the results object.")

    return detections




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

