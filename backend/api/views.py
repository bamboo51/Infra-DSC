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
from collections import defaultdict

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

        grouped_results = defaultdict(lambda: {"masks": [], "confidences": []})
        if results.masks is not None:
            for mask, cls, conf in zip(results.masks.data.cpu().numpy(), results.boxes.cls, results.boxes.conf):
                grouped_results[int(cls)]["masks"].append(mask)
                grouped_results[int(cls)]["confidences"].append(conf)

        masks = []
        for cls, mask_list in grouped_results.items():
            resized_masks = [cv2.resize(m, (image.width, image.height)) > 0.5 for m in mask_list["masks"]]
            combined_mask = np.logical_or.reduce(resized_masks)
            mask_img = np.zeros((image.height, image.width, 4), dtype=np.uint8)
            color_hex = SEGMENTATION_COLORS[cls % len(SEGMENTATION_COLORS)]
            r,g,b = int(color_hex[1:3], 16), int(color_hex[3:5], 16), int(color_hex[5:7], 16)
            alpha = 128

            mask_img[combined_mask] = [r, g, b, alpha]

            _, buffer = cv2.imencode('.png', mask_img)
            mask_base64 = base64.b64encode(buffer).decode('utf-8')
            mask_data_uri = f"data:image/png;base64,{mask_base64}"
            masks.append({
                "mask": mask_data_uri,
                "class_id": int(cls),
                "confidence": float(np.mean(mask_list["confidences"])),
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