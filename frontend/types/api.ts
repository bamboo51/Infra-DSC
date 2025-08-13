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

export interface ApiResponse {
  detection: Detection[];
  segmentation: Segmentation[];
  crack_ratio: number;
}

export interface SelectedFile {
  file: File;
  preview: string;
  coords: Coords | null;
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
}
