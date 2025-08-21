// types for detection and segmentation
import { Coords } from "@/types/coords";

export interface Detection {
  confidence: number;
  class_name: string;
  box_x1: number;
  box_y1: number;
  box_x2: number;
  box_y2: number;
}

export interface Segmentation {
  mask_uri: string;
  confidence: number;
  class_name: string;
}

// Client-side file handling before upload
export interface SelectedFile {
  file: File;
  preview: string;
  coords: Coords | null;
  crack_ratio: number;
}

export interface ApiResponse {
  detection: Detection[];
  segmentation: Segmentation[];
  crack_ratio: number;
}

export interface PhotoWithResults {
  id: number;
  image: string;
  uploaded_at: string;
  coords: Coords | null;
  crack_ratio: number;
  detections: Detection[] | null;
  segmentations: Segmentation[] | null;
  status?: string;
}

// Item from the GET /api/photos/ list endpoint
export interface PhotoMetadata {
  id: number;
  thumbnail: string;
  coords: Coords | null;
  uploaded_at: string;
}

// Response from the GET /api/photos/ endpoint.
export interface PaginatedPhotoList {
  count: number;
  next: string | null;
  previous: string | null;
  results: PhotoMetadata[];
}