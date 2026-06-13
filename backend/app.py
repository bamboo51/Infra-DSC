import datetime
import io
import uuid
from contextlib import asynccontextmanager
from typing import Optional

import imagehash
from download_weights import ensure_weights
from fastapi import (
    APIRouter,
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps
from schema import (
    Detection,
    ErrorResponse,
    PhotoListResponse,
    PhotoResponse,
    PhotoWithResults,
    PredictionResponse,
    Segmentation,
)
from utils import create_thumbnail, get_full_url, save_mask
from yolo import MLModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    weights = ensure_weights()
    app.state.ml_model = MLModel(
        detection_model_path=weights["detect.pt"],
        segmentation_model_path=weights["segment.pt"],
    )
    yield


# logging
import logging
import os
import traceback

from database import get_db
from models import Detection as DetectionModel
from models import Photo
from models import Segmentation as SegmentationModel
from sqlalchemy.orm import Session

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("app.log")],
)
logger = logging.getLogger(__name__)
logger.info("Application started")

os.makedirs("media/photos", exist_ok=True)
os.makedirs("media/thumbnails", exist_ok=True)
os.makedirs("media/masks", exist_ok=True)

app = FastAPI(
    title="Infra-DSC Backend API",
    version="1.0.0",
    description="API for road damage detection and segmentation using YOLO models.",
)
router = APIRouter(prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.post(
    "/predict/",
    response_model=PredictionResponse,
    responses={
        200: {"description": "Existing image found, returning cached results"},
        201: {"description": "New image processed and results created"},
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def predict(
    image: UploadFile = File(..., description="image file to be analyzed"),
    latitude: Optional[float] = Form(None, ge=-90, le=90),
    longitude: Optional[float] = Form(None, ge=-180, le=180),
    db: Session = Depends(get_db),
):
    logger.info(
        f"Starting prediction for image: {image.filename}, latitude: {latitude}, longitude: {longitude}"
    )

    # validate image file
    if not image.filename:
        logger.warning("No image file provided.")
        raise HTTPException(status_code=400, detail="No image file provided.")

    try:
        image_data = await image.read()
        logger.info(f"Read {len(image_data)} bytes from image file.")
        pil_image = Image.open(io.BytesIO(image_data))
        pil_image = ImageOps.exif_transpose(pil_image)
        pil_image = pil_image.convert("RGB")
    except Exception as e:
        logger.error(f"Invalid image file: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=400, detail="Invalid image file.") from e

    # calculate image hash
    logger.info("Calculating image hash.")
    try:
        hash_value = str(imagehash.phash(pil_image))
    except Exception as e:
        logger.error(f"Failed to calculate image hash: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500, detail=f"Failed to calculate image hash: {str(e)}"
        )

    # check for existing image in database
    existing_photo = db.query(Photo).filter(Photo.image_hash == hash_value).first()

    if existing_photo:
        logger.info(
            f"Found existing photo with ID: {existing_photo.id}, returning cached results."
        )
        detection_results = [
            {
                "box_x1": d.box_x1,
                "box_y1": d.box_y1,
                "box_x2": d.box_x2,
                "box_y2": d.box_y2,
                "class_name": d.class_name,
                "confidence": d.confidence,
            }
            for d in existing_photo.detections
        ]
        if not detection_results:
            logger.warning(
                f"No detection results found for existing photo ID: {existing_photo.id}"
            )

        segmentation_results = [
            {
                "mask_uri": get_full_url(s.mask_uri),
                "confidence": s.confidence,
                "class_name": s.class_name,
            }
            for s in existing_photo.segmentations
        ]
        if not segmentation_results:
            logger.warning(
                f"No segmentation results found for existing photo ID: {existing_photo.id}"
            )

        return JSONResponse(
            status_code=200,
            content={
                "detection": detection_results,
                "segmentation": segmentation_results,
                "crack_ratio": existing_photo.crack_ratio or 0.0,
            },
        )

    # reset file pointer and save new photo
    logger.info("Saving new photo to database.")
    try:
        # Create unique filename to avoid conflicts
        file_extension = os.path.splitext(image.filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = f"media/photos/{unique_filename}"

        # Reset file pointer
        await image.seek(0)

        # Save file to disk
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)

        logger.info(f"Saved image to {file_path}")

        # Create thumbnail
        try:
            thumbnail_path = create_thumbnail(pil_image, unique_filename)
            logger.info(f"Created thumbnail at {thumbnail_path}")
        except Exception as e:
            logger.error(f"Failed to create thumbnail: {str(e)}")
            logger.error(traceback.format_exc())
            thumbnail_path = None

        # Create database record
        photo_instance = Photo(
            image=file_path,
            thumbnail=thumbnail_path,
            image_hash=hash_value,
            latitude=latitude,
            longitude=longitude,
            uploaded_at=datetime.datetime.now(datetime.timezone.utc),
        )
        db.add(photo_instance)
        db.commit()
        db.refresh(photo_instance)

        logger.info(f"Created new photo with ID: {photo_instance.id}")

    except Exception as e:
        logger.error(f"Failed to save photo: {str(e)}")
        logger.error(traceback.format_exc())
        db.rollback()

        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed file at {file_path} due to error during save.")
        if thumbnail_path and os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)
            logger.info(
                f"Removed thumbnail at {thumbnail_path} due to error during save."
            )
        # Clean up file if it was created
        raise HTTPException(status_code=500, detail=f"Failed to save photo: {str(e)}")

    # perform model inference
    logger.info("Performing model inference.")
    try:
        ml_model = MLModel()
        logger.info("Running detection model.")
        detection_results = ml_model.detection(pil_image)
        logger.info("Running segmentation model.")
        segmentation_results, crack_ratio = ml_model.segmentation(pil_image)
        photo_instance.crack_ratio = crack_ratio
        logger.info(
            f"Model inference completed for photo ID: {photo_instance.id} with crack ratio: {crack_ratio}"
        )
        db.commit()
    except Exception as e:
        logger.error(f"Model inference failed: {str(e)}")
        logger.error(traceback.format_exc())
        db.rollback()
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed file at {file_path} due to error during inference.")
        if thumbnail_path and os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)
            logger.info(
                f"Removed thumbnail at {thumbnail_path} due to error during inference."
            )
        raise HTTPException(status_code=500, detail=f"Model inference failed: {str(e)}")

    # save detection results
    logger.info("Saving detection and segmentation results...")
    try:
        for i, det in enumerate(detection_results):
            logger.debug(f"Saving detection {i + 1}/{len(detection_results)}")
            det_instance = DetectionModel(
                photo_id=photo_instance.id,
                class_name=det["class_name"],
                confidence=det["confidence"],
                box_x1=det["box_x1"],
                box_y1=det["box_y1"],
                box_x2=det["box_x2"],
                box_y2=det["box_y2"],
            )
            db.add(det_instance)

            # Save segmentation results
        for i, seg in enumerate(segmentation_results):
            logger.debug(f"Saving segmentation {i + 1}/{len(segmentation_results)}")
            seg_instance = SegmentationModel(
                photo_id=photo_instance.id,
                class_name=seg["class_name"],
                confidence=seg["confidence"],
                mask_uri=save_mask(
                    seg["mask_uri"], photo_instance.id, i, seg["class_name"]
                ),
            )
            db.add(seg_instance)

        db.commit()
        logger.info("All results saved successfully")

    except Exception as e:
        logger.error(f"Error saving results: {str(e)}")
        logger.error(traceback.format_exc())
        db.rollback()

        if file_path and os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed file at {file_path} due to error during result save.")
        if thumbnail_path and os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)
            logger.info(
                f"Removed thumbnail at {thumbnail_path} due to error during result save."
            )
        raise HTTPException(status_code=500, detail=f"Failed to save results: {str(e)}")

    logger.info("Prediction completed successfully")

    return JSONResponse(
        status_code=201,
        content={
            "detection": detection_results,
            "segmentation": segmentation_results,
            "crack_ratio": crack_ratio or 0.0,
        },
    )


@router.get("/photos/", response_model=PhotoListResponse)
async def list_photos(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * page_size
    total_count = db.query(Photo).count()
    photos = (
        db.query(Photo)
        .order_by(Photo.uploaded_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # convert to response model
    photo_responses = [
        PhotoResponse(
            id=photo.id,
            image=get_full_url(photo.image),
            thumbnail=get_full_url(getattr(photo, "thumbnail", None)),
            uploaded_at=photo.uploaded_at,
            crack_ratio=photo.crack_ratio or 0.0,
            coords={"latitude": photo.latitude, "longitude": photo.longitude}
            if photo.latitude and photo.longitude
            else None,
        )
        for photo in photos
    ]

    # calculate pagination urls
    next_url = None
    previous_url = None

    if offset + page_size < total_count:
        next_url = f"/photos/?page={page + 1}&page_size={page_size}"
    if page > 1:
        previous_url = f"/photos/?page={page - 1}&page_size={page_size}"
    return PhotoListResponse(
        count=total_count, next=next_url, previous=previous_url, results=photo_responses
    )


@router.get(
    "/photos/{id}/",
    response_model=PhotoWithResults,
    responses={404: {"model": ErrorResponse, "description": "Photo not found"}},
)
async def get_photo_details(id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found.")
    detections = db.query(DetectionModel).filter(DetectionModel.photo_id == id).all()
    segmentations = (
        db.query(SegmentationModel).filter(SegmentationModel.photo_id == id).all()
    )

    detection_responses = [
        Detection(
            class_name=d.class_name,
            confidence=d.confidence,
            box_x1=d.box_x1,
            box_y1=d.box_y1,
            box_x2=d.box_x2,
            box_y2=d.box_y2,
        )
        for d in detections
    ]

    segmentation_responses = [
        Segmentation(
            class_name=s.class_name,
            confidence=s.confidence,
            mask_uri=get_full_url(s.mask_uri),
        )
        for s in segmentations
    ]

    return PhotoWithResults(
        id=photo.id,
        image=get_full_url(photo.image),
        thumbnail=get_full_url(getattr(photo, "thumbnail", None)),
        uploaded_at=photo.uploaded_at,
        coords={"latitude": photo.latitude, "longitude": photo.longitude}
        if photo.latitude and photo.longitude
        else None,
        crack_ratio=photo.crack_ratio or 0.0,
        detections=detection_responses,
        segmentations=segmentation_responses,
    )


app.include_router(router)
app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
