import base64
import os
from ultralytics import YOLO
import torch
from PIL import Image
from typing import List, Dict
from fastapi import FastAPI, HTTPException
from collections import defaultdict
import cv2
import numpy as np

DETECTION_MODEL_PATH = os.path.join(os.getcwd(), "weights", "detect.pt")
SEGMENTATION_MODEL_PATH = os.path.join(os.getcwd(), "weights", "segment.pt")

class MLModel:
    def __init__(self, detection_model_path=DETECTION_MODEL_PATH, segmentation_model_path=SEGMENTATION_MODEL_PATH):
        self.detection_model = YOLO(detection_model_path)
        self.segmentation_model = YOLO(segmentation_model_path)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def detection(self, image: Image.Image, name: str= None) -> List[Dict]:
        """Perform crack detection on the input image."""
        if self.detection_model is None:
            raise HTTPException(status_code=500, detail="Detection model not loaded.")
        
        results = self.detection_model.predict(source=image, device=self.device, conf=0.25, save=False, save_txt=False)
        predictions = []

        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    cls_id = int(box.cls[0].item())
                    class_name = self.detection_model.names[cls_id] if cls_id < len(self.detection_model.names) else "unknown"
                    confidence = float(box.conf[0].item())
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    prediction = {
                        "box_x1": int(box.xyxy[0][0]),
                        "box_y1": int(box.xyxy[0][1]),
                        "box_x2": int(box.xyxy[0][2]),
                        "box_y2": int(box.xyxy[0][3]),
                        "confidence": float(box.conf[0]),
                        "class_id": int(box.cls[0]),
                        "class_name": self.detection_model.names[int(box.cls[0])]
                    }
                    predictions.append(prediction)
        return predictions
    
    def segmentation(self, image: Image.Image, name: str= None) -> tuple[Dict]:
        """Perform crack segmentation and calculate crack ratio"""
        if self.segmentation_model is None:
            raise HTTPException(status_code=500, detail="Segmentation model not loaded.")
        
        SEGMENTATION_COLOR = ['#92CC17', '#3DDB86', '#1A9334', '#00D4BB', '#2C99A8']
        DAMAGE_CLASSES = {'crack', 'pothole'}

        results = self.segmentation_model.predict(source=image, device=self.device, conf=0.25, save=False, save_txt=False)[0]
        grouped_results = defaultdict(lambda: {"masks": [], "confidences": []})

        if results.masks is not None:
            for mask, cls, conf in zip(results.masks.data.cpu().numpy(), results.boxes.cls.cpu().numpy(), results.boxes.conf.cpu().numpy()):
                grouped_results[int(cls)]["masks"].append(mask)
                grouped_results[int(cls)]["confidences"].append(conf)
        masks = []
        damage_pixel_count = 0
        total_pixel_count = 0

        for cls, mask_list in grouped_results.items():
            class_name = self.segmentation_model.names[int(cls)]
            resized_masks = [
                cv2.resize(m, (image.width, image.height), interpolation=cv2.INTER_NEAREST)
                for m in mask_list["masks"]
            ]
            combined_mask = np.logical_or.reduce(resized_masks)
            current_class_pixels = np.sum(combined_mask)
            total_pixel_count += current_class_pixels

            if class_name in DAMAGE_CLASSES:
                damage_pixel_count += current_class_pixels
            mask_img = np.zeros((image.height, image.width, 4), dtype=np.uint8)
            color_hex = SEGMENTATION_COLOR[cls % len(SEGMENTATION_COLOR)]
            r, g, b = int(color_hex[1:3], 16), int(color_hex[3:5], 16), int(color_hex[5:7], 16)
            alpha = 128
            mask_img[combined_mask] = [r, g, b, alpha]

            _, buffer = cv2.imencode(".png", mask_img)
            mask_base64 = base64.b64encode(buffer).decode('utf-8')
            mask_data_uri = f"data:image/png;base64,{mask_base64}"

            masks.append({
                "mask_uri": mask_data_uri,
                "class_id": int(cls),
                "confidence": float(np.mean(mask_list["confidences"])),
                "class_name": class_name
            })
        crack_ratio = (damage_pixel_count / total_pixel_count) if total_pixel_count > 0 else 0.0
        return masks, crack_ratio
    