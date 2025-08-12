// types for detection and segmentation
import { Coords } from "@/types/coords";

export interface Detection {
  box: [number, number, number, number];
  confidence: number;
  class_id: number;
  class_name: string;
}

export interface Segmentation {
  mask: string;
  confidence: number;
  class_id: number;
  class_name: string;
}

export interface ApiResponse {
  detection: Detection[];
  segmentation: Segmentation[];
}

export interface SelectedFile {
  file: File;
  preview: string;
  coords?: Coords;
}