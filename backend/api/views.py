from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.conf import settings
import os

from ultralytics import YOLO
from PIL import Image
import numpy as np
import io
import cv2
import base64

DETECT_MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "weights", "detect.pt")
SEGMENT_MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "weights", "segment.pt")
detect_model = YOLO(DETECT_MODEL_PATH)
segment_model = YOLO(SEGMENT_MODEL_PATH)

class YOLOPredictionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def detection(self, model=detect_model, image=None):
        results = model.predict(image)
        predictions = []

        for result in results:
            boxes = result.boxes
            for i in range(len(boxes)):
                box = boxes[i]
                prediction = {
                    "box": [float(coord) for coord in box.xyxy[0]],
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0]),
                    "class_name": detect_model.names[int(box.cls[0])]
                }
                predictions.append(prediction)

        return predictions
    
    def segmentation(self, model=segment_model, image=None):
        SEGMENTATION_COLORS = ['#92CC17', '#3DDB86', '#1A9334', '#00D4BB', '#2C99A8']
        results = model.predict(image)[0]
        masks = []
        if results.masks is not None:
            for mask, cls, conf in zip(results.masks.data.cpu().numpy(), results.boxes.cls, results.boxes.conf):
                # Resize mask to original image size
                mask_resized = cv2.resize(mask, (image.width, image.height))

                # Create empty RGBA image for mask overlay
                mask_img = np.zeros((image.height, image.width, 4), dtype=np.uint8)

                # Extract color and alpha
                color = SEGMENTATION_COLORS[int(cls) % len(SEGMENTATION_COLORS)]
                r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
                alpha = 128  # semi-transparent

                # Apply color only where mask > 0.5 (threshold)
                mask_bool = mask_resized > 0.5
                mask_img[mask_bool, 0] = r
                mask_img[mask_bool, 1] = g
                mask_img[mask_bool, 2] = b
                mask_img[mask_bool, 3] = alpha

                # Encode to PNG and base64
                _, buffer = cv2.imencode('.png', mask_img)
                mask_base64 = base64.b64encode(buffer).decode('utf-8')
                mask_data_uri = f"data:image/png;base64,{mask_base64}"

                masks.append({
                    "mask": mask_data_uri,
                    "class_id": int(cls),
                    "confidence": float(conf),
                    "class_name": segment_model.names[int(cls)]
                })
        return masks

    def post(self, request, *args, **kwargs):
        # check if an image file is present in the request
        if "image" not in request.data:
            return Response(
                {"error": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        image_file = request.data["image"]

        # read the image file
        try:
            image = Image.open(image_file)
        except Exception as e:
            return Response(
                {"error": f"Invalid image file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # perform inference
        detection_results = self.detection(image=image)
        segmentation_results = self.segmentation(image=image)

        return Response({
            "detection": detection_results,
            "segmentation": segmentation_results
        }, status=status.HTTP_200_OK)