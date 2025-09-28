from PIL import Image
import base64
import json
import os
from dotenv import load_dotenv

load_dotenv(".env.local")
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

def create_thumbnail(image: Image.Image, filename: str)->str:
    """Create a thumbnail from the original image"""
    try:
        thumbnail = image.copy()
        thumbnail.thumbnail((150, 150), Image.Resampling.LANCZOS)

        thumbnail_filename = f"thumb_{filename}"
        thumb_path = f"media/thumbnails/{thumbnail_filename}"
        thumbnail.save(thumb_path, format="JPEG")
        return thumb_path
    except Exception as e:
        raise RuntimeError(f"Failed to create thumbnail: {str(e)}") from e

def get_full_url(file_path: str) -> str:
    """Convert relative file path to full URL"""
    if not file_path:
        return None
    if file_path.startswith('http'):
        return file_path  # Already a full URL
    return f"{API_BASE_URL}/{file_path}"
    
def save_mask(mask_data: str, photo_id: int, seg_index: int, class_name: str="unknown")->str:
    """Save mask data to file and return the file path"""
    if isinstance(mask_data, str) and mask_data.startswith("data:image/png;base64,"):
        try:
            safe_cls_name = "".join(c for c in class_name if c.isalnum() or c in ('_','-'))
            mask_filename = f"mask_{photo_id}_{safe_cls_name}_{seg_index}.png"
            mask_path = f"media/masks/{mask_filename}"

            base64_data = mask_data.split(",")[1]
            mask_bytes = base64.b64decode(base64_data)

            with open(mask_path, "wb") as f:
                f.write(mask_bytes)
            
            if os.path.exists(mask_path) and os.path.getsize(mask_path) > 0:
                return mask_path
            else:
                raise RuntimeError("Mask file was not created successfully.")
        except Exception as e:
            raise RuntimeError(f"Failed to save mask: {str(e)}") from e
        
    elif isinstance(mask_data, str) and (mask_data.startswith("data:image") or len(mask_data)>1000):
        if "jpeg" in mask_data or "jpg" in mask_data:
            ext = "jpg"
        elif "png" in mask_data:
            ext = "png"
        else:
            ext = "png"
        safe_cls_name = "".join(c for c in class_name if c.isalnum() or c in ('_','-'))
        mask_filename = f"mask_{photo_id}_{safe_cls_name}_{seg_index}.{ext}"
        mask_path = f"media/masks/{mask_filename}"

        try:
            if mask_data.startswith("data:image"):
                base64_data = mask_data.split(",")[1]
            else:
                base64_data = mask_data
            mask_bytes = base64.b64decode(base64_data)

            with open(mask_path, "wb") as f:
                f.write(mask_bytes)

            if os.path.exists(mask_path) and os.path.getsize(mask_path) > 0:
                return mask_path
            else:
                raise RuntimeError("Mask file was not created successfully.")
        except Exception as e:
            raise RuntimeError(f"Failed to save mask: {str(e)}") from e
        
    elif isinstance(mask_data, (dict, list)):
        safe_cls_name = "".join(c for c in class_name if c.isalnum() or c in ('_','-'))
        mask_filename = f"mask_{photo_id}_{safe_cls_name}_{seg_index}.json"
        mask_path = f"media/masks/{mask_filename}"
        with open(mask_path, "w") as f:
            json.dump(mask_data, f, indent=2)
        return mask_path
    
    elif isinstance(mask_data, str) and len(mask_data)>255:
        safe_cls_name = "".join(c for c in class_name if c.isalnum() or c in ('_','-'))
        mask_filename = f"mask_{photo_id}_{safe_cls_name}_{seg_index}.txt"
        mask_path = f"media/masks/{mask_filename}"
        with open(mask_path, "w") as f:
            f.write(mask_data)
        return mask_path
    else:
        raise ValueError("Invalid mask data format.")
    