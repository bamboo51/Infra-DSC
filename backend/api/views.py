from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.conf import settings
import os

from ultralytics import YOLO
from PIL import Image
import io

MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "weights", "best.pt")
model = YOLO(MODEL_PATH)

class YOLOPredictionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

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
        results = model(image)

        predictions = []
        for result in results:
            boxes = result.boxes
            for i in range(len(boxes)):
                box = boxes[i]
                prediction = {
                    "box": [float(coord) for coord in box.xyxy[0]],
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0]),
                    "class_name": model.names[int(box.cls[0])]
                }
                predictions.append(prediction)

        return Response({"predictions": predictions}, status=status.HTTP_200_OK)