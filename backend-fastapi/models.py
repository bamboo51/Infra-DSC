from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime, timezone

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(String(255), nullable=False)
    image_hash = Column(String(64), unique=True, nullable=False, index=True)
    thumbnail = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.now(timezone.utc))
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    crack_ratio = Column(Float, nullable=True)

    detections = relationship("Detection", back_populates="photo", cascade="all, delete-orphan")
    segmentations = relationship("Segmentation", back_populates="photo", cascade="all, delete-orphan")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id", ondelete="CASCADE"))
    class_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    box_x1 = Column(Integer, nullable=False)
    box_y1 = Column(Integer, nullable=False)
    box_x2 = Column(Integer, nullable=False)
    box_y2 = Column(Integer, nullable=False)

    photo = relationship("Photo", back_populates="detections")

class Segmentation(Base):
    __tablename__ = "segmentations"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id", ondelete="CASCADE"))
    class_name = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    mask_uri = Column(Text, nullable=False)

    photo = relationship("Photo", back_populates="segmentations")
