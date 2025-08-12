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
import imagehash
import json

from .models import Photo
from .serializer import PhotoSerializer, DetectionSerializer, SegmentationSerializer, AllResultsPhotoSerializer

DETECT_MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "weights", "detect.pt")
SEGMENT_MODEL_PATH = os.path.join(settings.BASE_DIR, "api", "weights", "segment.pt")
detect_model = YOLO(DETECT_MODEL_PATH)
segment_model = YOLO(SEGMENT_MODEL_PATH)

class YOLOPredictionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def detection(self, model=detect_model, image=None, name=None):
        #print(f"detection: {name}")
        results = model.predict(image)
        predictions = []

        for result in results:
            boxes = result.boxes
            for i in range(len(boxes)):
                box = boxes[i]
                prediction = {
                    "box_x1": int(box.xyxy[0][0]),
                    "box_y1": int(box.xyxy[0][1]),
                    "box_x2": int(box.xyxy[0][2]),
                    "box_y2": int(box.xyxy[0][3]),
                    "confidence": float(box.conf[0]),
                    "class_id": int(box.cls[0]),
                    "class_name": detect_model.names[int(box.cls[0])]
                }
                predictions.append(prediction)

        return predictions
    
    def segmentation(self, model=segment_model, image=None, name=None):
        #print(f"segmentation: {name}")
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
                "mask_uri": mask_data_uri,
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
        latitude = request.data["latitude"]
        longitude = request.data["longitude"]

        # read image into memory for hashing and processing
        try:
            image_data = image_file.read()
            pil_image = Image.open(io.BytesIO(image_data))
        except Exception as e:
            return Response({"error": f"Invalid image file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # calculate image hash
        try:
            hash_value = str(imagehash.phash(pil_image))
        except Exception as e:
            return Response({"error": f"Failed to calculate image hash: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        existing_photo = Photo.objects.filter(image_hash=hash_value).first()
        if existing_photo:
            detection_results = [
                {
                    "box_x1": d.box_x1,
                    "box_y1": d.box_y1,
                    "box_x2": d.box_x2,
                    "box_y2": d.box_y2,
                    "class_name": d.class_name,
                    "confidence": d.confidence
                } for d in existing_photo.detections.all()
            ]
            segmentation_results = [
                {
                    "mask_uri": s.mask_uri,
                    "confidence": s.confidence,
                    "class_name": s.class_name
                } for s in existing_photo.segmentations.all()
            ]
            print("Found existing photo:", existing_photo.id)

            return Response({
                "detection": detection_results,
                "segmentation": segmentation_results,
                #"photo_id": existing_photo.id
            }, status=status.HTTP_200_OK)

        image_file.seek(0)

        # save photo to database
        photo_serializer = PhotoSerializer(data={"image": image_file})
        if photo_serializer.is_valid():
            photo_instance = photo_serializer.save(image_hash=hash_value, latitude=latitude, longitude=longitude)
        else:
            return Response(
                {"error": "Failed to save photo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # perform inference
        detection_results = self.detection(image=pil_image, name=image_file.name)
        segmentation_results = self.segmentation(image=pil_image, name=image_file.name)

        # save detections to database
        for det in detection_results:
            detection_data = {
                "photo": photo_instance.id,
                "class_name": det["class_name"],
                "confidence": det["confidence"],
                "box_x1": det["box_x1"],
                "box_y1": det["box_y1"],
                "box_x2": det["box_x2"],
                "box_y2": det["box_y2"],
            }
            detection_serializer = DetectionSerializer(data=detection_data)
            if detection_serializer.is_valid():
                detection_serializer.save()
            else:
                print(f"Failed to save detection: {detection_serializer.errors}")

        # save segmentations to database
        for seg in segmentation_results:
            segmentation_data = {
                "photo": photo_instance.id,
                "mask_uri": seg["mask_uri"],
                "class_name": seg["class_name"],
                "confidence": seg["confidence"]
            }
            segmentation_serializer = SegmentationSerializer(data=segmentation_data)
            if segmentation_serializer.is_valid():
                segmentation_serializer.save()
            else:
                print(f"Failed to save segmentation: {segmentation_serializer.errors}")

        return Response({
            "detection": detection_results,
            "segmentation": segmentation_results,
            #"photo_id": photo_instance.id # further id for user login and rewards
        }, status=status.HTTP_201_CREATED)

class AllResultsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            all_photos = Photo.objects.prefetch_related(
                'detections', 
                'segmentations'
            ).all().order_by("-uploaded_at")
            print(f"--- [2] Found {len(all_photos)} photos. Starting serialization...")
            serializer = AllResultsPhotoSerializer(all_photos, many=True, context={'request': request})
            print("--- [3] Serialization complete. Sending response.")
            with open("test.txt", "w") as f:
                f.write(json.dumps(serializer.data, indent=2))
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)