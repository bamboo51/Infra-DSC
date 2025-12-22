from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Coords(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class Detection(BaseModel):
    class_name: str
    confidence: float = Field(..., ge=0, le=1)
    box_x1: int
    box_y1: int
    box_x2: int
    box_y2: int

class Segmentation(BaseModel):
    class_name: str
    confidence: float = Field(..., ge=0, le=1)
    mask_uri: str = Field(..., description="Base64-encoded PNG image data URI")

class PhotoBase(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)

class PhotoResponse(BaseModel):
    id: int
    image: str = Field(..., description="Original image URL")
    thumbnail: Optional[str] = None
    uploaded_at: datetime
    coords: Optional[Coords] = None
    crack_ratio: Optional[float] = None

class PredictionResponse(BaseModel):
    detection: List[Detection]
    segmentation: List[Segmentation]
    crack_ratio: float

class PhotoWithResults(BaseModel):
    id: int
    image: str
    uploaded_at: datetime
    coords: Optional[Coords] = None
    crack_ratio: float
    detections: List[Detection]
    segmentations: List[Segmentation]

class PhotoListResponse(BaseModel):
    count: int
    next: Optional[str] = None
    previous: Optional[str] = None
    results: List[PhotoResponse]

class ErrorResponse(BaseModel):
    error: str