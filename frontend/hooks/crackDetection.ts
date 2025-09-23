import { ApiService } from "@/services/mlService";
import { ApiResponse, SelectedFile } from "@/types/api";
import { CanvasDrawer } from "@/utils/canvasDrawer";
import { useEffect, useRef, useState } from "react";
import EXIF from "exif-js";
import { Coords } from "@/types/coords";

export const crackDetection = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, ApiResponse>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeFile =
    activeFileIndex !== null ? selectedFiles[activeFileIndex] : null;

  const getExifData = (file: File): Promise<Coords | null> => {
    return new Promise((resolve) => {
      EXIF.getData(file as any, function (this: any) {
        const latitude = EXIF.getTag(this, "GPSLatitude");
        const longitude = EXIF.getTag(this, "GPSLongitude");

        if (Array.isArray(latitude) && Array.isArray(longitude)) {
          const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
          const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";

          const latDec = latitude[0] + latitude[1] / 60 + latitude[2] / 3600;
          const lonDec = longitude[0] + longitude[1] / 60 + longitude[2] / 3600;

          resolve({
            latitude: latRef === "N" ? latDec : -latDec,
            longitude: lonRef === "E" ? lonDec : -lonDec,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const processFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      setError("");
      const filesArray = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (filesArray.length === 0) {
        setError("No valid image files found.");
        return;
      }

      const filePromises = filesArray.map(async (file) => {
        const coords = await getExifData(file);
        const compressedFile = await compressImage(file);
        const previewUrl = URL.createObjectURL(compressedFile);
        return {
          file: compressedFile,
          preview: previewUrl,
          coords,
          crack_ratio: 0
        }
      });

      Promise.all(filePromises).then((newFiles) => {
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        if (activeFileIndex === null && updatedFiles.length > 0) {
          setActiveFileIndex(0);
        }
      });
    }
  };

  /**
   * Draw the results on the canvas.
   */
  const handlePredictAll = async () => {
    if (selectedFiles.length === 0) {
      setError("No images selected for prediction.");
      return;
    }
    setIsLoading(true);
    setError("");

    const predictionsToRun = selectedFiles
      .map((file, index) => ({ file, index }))
      .filter(({ index }) => !results[index]);

    if (predictionsToRun.length === 0) {
      setIsLoading(false);
      return;
    }

    const newResults: Record<number, ApiResponse> = {};
    for (const { file, index } of predictionsToRun) {
      try {
        const response = await ApiService.predict(file.file, file.coords);
        newResults[index] = response;
      } catch (err) {
        console.error("Prediciton failed for file", index, err);
        setError("One or more predictions failed.");
      }
    }

    setResults((prev) => ({ ...prev, ...newResults }));
    setIsLoading(false);
  };

  useEffect(() => {
    const drawCanvas = async () => {
      if (!activeFile || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const resultForActiveFile =
        activeFileIndex !== null ? results[activeFileIndex] : null;

      await CanvasDrawer.drawImage(ctx, activeFile.preview);

      if (resultForActiveFile) {
        await CanvasDrawer.drawSegmentationMask(
          ctx,
          resultForActiveFile.segmentation
        );
        CanvasDrawer.drawDetectionBoxes(ctx, resultForActiveFile.detection);
        CanvasDrawer.drawDamageRatio(ctx, resultForActiveFile.crack_ratio);
      }
    };

    drawCanvas();
  }, [activeFile, activeFileIndex, results]);

  return {
    selectedFiles,
    activeFileIndex,
    setActiveFileIndex,
    results,
    isLoading,
    isDragging,
    setIsDragging,
    error,
    canvasRef,
    processFiles,
    handlePredictAll,
  };
};

/* helper for compress the file */
const compressImage = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.8): Promise<File> => {
  return new Promise((resolve)=>{
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      if(width>maxWidth || height > maxHeight){
        const ratio = Math.min(maxHeight/height, maxWidth/width);
        width = width * ratio;
        height = height * ratio;
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0,0, width, height);

      canvas.toBlob(
        (blob) => {
          if(blob){
            const compressedFile = new File([blob], file.name, {type: "image/jpg"});
            resolve(compressedFile);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
